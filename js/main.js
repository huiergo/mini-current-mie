import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataCenter from './dataCenter';
import BackGround from './runtime/background'

const ctx = canvas.getContext('2d')

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

    this.bg = new BackGround(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.dataCenter = new DataCenter()

    this.stack = this.dataCenter.stack

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
    this.dataCenter.boxDataFlat.forEach(box => {
      let isXok = (touchX >= box.x && touchX <= box.x + box.width)
      let isYok = (touchY >= box.y && touchY <= box.y + box.height)
      if (isXok && isYok && box.canClick) {
        this.insertPool(box)
        box.setFallDown(true)
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

    this.dispearSame(this.stack, 3)

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
      countObj[element.elementType]++
      if (countObj[element.elementType] === 3) {
        // element.isPlayMusic = true
      }

    });

    this.stack.forEach(element => {
      // let count = countObj[element.elementType]
      // if (count == 3) {
      if (element.dispear) {
        element.willRemove = true
      } else {
        element.willRemove = false
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


  // 判断3个就消除: 
  // 扩展算法： 连着几个消掉

  dispearSame(array, count) {
    // let array = deepClone(paramsArr)
    for (let i = 0; i < array.length; i++) {
      //  如果有一个不相等， i 就需要移动到当前 j 的位置
      // 如果都相等 ， 1. 消除3个， 2  i 移动到最后一个 j的位置

      let flag = 1 // 判断 flag === count
      let flagIndexList = []  // 设置 满足条件 的元素 dispear = true
      let c = 1 // 控制 j 加加的次数

      for (let j = i + c; c < count; j++) {
        console.log(i, j, c)
        if (array[i] && array[j] && array[i].elementType === array[j].elementType) {
          flag++
          flagIndexList.push(j)
        }
        c++
      }
      if (flag === count) {
        flagIndexList.push(i)
        i = i + count - 1
        flagIndexList.forEach(item => {
          array[item].setDispear(true)
        })
      }

    }
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
      // add: 
      element.updatePosition(element.x, element.y)

      if (element.targetY != element.y) {
        isFlying = true
      }

      //Todo 此处可以根据canClick设置图片灰色还是高亮
    });

    // 去重算法，boom
    if (!isFlying) {
      this.stack.forEach(element => {
        // let count = countObj[element.elementType]
        // if (count == 3) {
        if (element.dispear) {
          if (!element.isStart) {
            element.playAnimation()
            this.music.playExplosion()
          }
        }
        if (element.isPlaying) {
          isBooming = true
        }
      });
    }

    //最终平移
    if (!isFlying && !isBooming) {
      this.stack = this.stack.filter(element => {
        return element.willRemove == false;
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
        if (element.willRemove) {
          score++;
        }
      });
    }
  }

  // 实现游戏帧循环
  loop() {
    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //绘制格子
    this.dataCenter.boxDataFlat.forEach(box => {
      box.drawToCanvas(ctx)
    });

    //播放boom
    this.dataCenter.animations.forEach(ani => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    //todo 绘制背景

    //todo 绘制分数
    this.gameinfo.renderGameScore(ctx, score)
  }
}


