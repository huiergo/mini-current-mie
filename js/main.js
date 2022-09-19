import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import DataCenter from './dataCenter';
import Box from './runtime/box'

const ctx = canvas.getContext('2d')
const databus = new DataBus()

const fixedW = 95;

const BG_IMG_SRC = 'images/bg.jpg'

// todo: 整理到常量池
let score = 0;

const speed = 10;
// todo: 现在是每层的图案是一样的，这个需要做到 图片随机， 所以 这里要改！！！
let countObj = {
  0: 0,
  1: 0,
  2: 0,
};
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )


    canvas.removeEventListener(
      'touchend',
      this.touchHandler
    )

    this.touchEndHandler = this.touchEndHandler.bind(this)
    canvas.addEventListener('touchend', this.touchEndHandler)



    let img = new Image();
    img.src = BG_IMG_SRC;
    // this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.dataCenter = new DataCenter()

    this.box = new Box(ctx)

    // 插槽区
    this.stack = this.dataCenter.stack


    ctx.drawImage(img, 0, 0, 50, 50)

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }


  touchEndHandler(e) {
    e.preventDefault()

    let touchX = e.changedTouches[0].clientX
    let touchY = e.changedTouches[0].clientY

    console.log(touchX, touchY)
    let touchBox = null
    console.log(this.dataCenter.boxDataFlat)

    this.dataCenter.boxDataFlat.forEach(box => {
      let isXok = (touchX >= box.x && touchX <= box.x + box.width)
      let isYok = (touchY >= box.y && touchY <= box.y + box.height)
      if (isXok && isYok && box.highlight) {
        console.log("插入---》", box.row, box.col)
        this.insertPool(box)
        box.setRemove(true)
        this.dataCenter.judgeOverlay()
      }
    })
  }

  insertPool(box) {
    if (this.stack.length >= this.dataCenter.stackPoolLength) {
      return
    }

    // 具体插入到哪个位置
    let insertIndex = 0;
    let hasSimple = false;

    // 判断插入到什么位置
    this.stack.forEach(element => {
      if (box.elementType == element.elementType) {
        hasSimple = true;
        insertIndex++;
      } else {
        if (hasSimple) return
        else {
          insertIndex++;
        }
      }
    });

    // 插入操作
    if (this.stack.length == insertIndex) {
      this.stack.push(box)
    } else {
      this.stack.splice(insertIndex, 0, box)
    }


    console.log("---->", this.stack)


    this.initCountObj()

    // 重新规整数据，赋值targetY，targetX
    this.stack.forEach((element, index) => {
      //设置目标位置
      element.setTargetPoint(index * element.width, 400)
      let distanceY = element.targetY - element.y
      let distanceX = Math.abs(element.targetX - element.x)

      // 此处根据Y下落速度计算X下落速度，防止X位移距离过小，导致Y轴速度过快
      let k = 0
      if (distanceX == 0) {
        k = 0
      } else {
        k = distanceX / distanceY
      }
      element.setVelocity(k * speed, speed)
      console.log('----> element.elementType--->', element.elementType)
      countObj[element.elementType]++
      if (countObj[element.elementType] === 3) {
        element.isPlayMusic = true
      }

    });


    console.log('countObj---->', countObj)

    this.stack.forEach(element => {
      let count = countObj[element.elementType]
      if (count == 3) {
        // element.setHidden(true)
        element.setBoomCount(5)

        console.log('boom=====>')

      } else {
        // element.setHidden(false)
        element.setBoomCount(0)
      }
    });


  }

  initCountObj() {
    countObj = {
      0: 0,
      1: 0,
      2: 0,
    };
  }


  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    const area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.renderBoxList()
  }

  // 游戏逻辑更新主函数
  update() {
    let isFlying = false
    let isBooming = false

    // 两部操作，1 下落，2 平移
    this.dataCenter.boxDataFlat.forEach(element => {
      if (element.targetY > element.y) {
        element.y = element.y + element.speedY
      } else {
        element.y = element.targetY
      }

      if (element.targetX > element.x) {
        element.x = Math.abs(element.x - element.targetX) < element.speedX ? element.targetX : element.x + element.speedX
      } else {
        element.x = Math.abs(element.x - element.targetX) <= element.speedX ? element.targetX : element.x - element.speedX

      }

      if (element.targetY != element.y) {
        isFlying = true
      }

    });

    // 去重算法，boom

    if (!isFlying) {
      this.stack.forEach(element => {
        let count = countObj[element.elementType]
        if (count == 3) {
          if (element.isPlayMusic) {
            this.music.playExplosion()
            console.log('111')
            element.isPlayMusic = false
          }
          element.setHidden(true)
        } else {
          element.setHidden(false)
        }

        if (element.boomCount > 0) {
          element.boomCount--;
          isBooming = true;
        } else {
          element.boomCount = 0
        }
      });
    }

    // 最终平移
    if (!isFlying && !isBooming) {
      this.stack = this.stack.filter(element => {
        return element.hidden == false;
      });

      // 重新规整数据，赋值targetY，targetX
      this.stack.forEach((element, index) => {
        //设置目标位置
        element.setTargetPoint(index * element.width, 400)
        let distanceY = element.targetY - element.y
        let distanceX = Math.abs(element.targetX - element.x)

        // 此处根据Y下落速度计算X下落速度，防止X位移距离过小，导致Y轴速度过快
        let k = 0
        if (distanceX == 0) {
          k = 0
        } else {
          k = distanceX / distanceY
        }
        element.setVelocity(k * speed, speed)
      });

      // 分数增加
      score = 0
      this.dataCenter.boxDataFlat.forEach(element => {
        if (element.hidden) {
          score++;
        }
      });
    }

  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  //  渲染boxList 中所有的数据
  renderBoxList() {
    this.dataCenter.boxDataFlat.forEach(box => {
      if (box.hidden) {
        if (box.boomCount > 0) {
          // 渲染爆炸图片
          this.box.renderBoom(fixedW * (5 - box.boomCount), 0, box.x, box.y);
        }
      } else {
        //  渲染本身图片
        // this.box.render˝Self(fixedW * box.elementType, 0, box.x, box.y);
        let img = new Image()
        img.src = box.highlight ? box.img : box.disabledImg
        this.box.renderSelf(img, box.x, box.y, box.width, box.height);
      }
    });
  }
}


