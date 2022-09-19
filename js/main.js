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

const BG_IMG_SRC = 'images/bg.jpg'
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
      if (isXok && isYok) {
        // todo: insertPoll
        // if(box.highlight){
        if (box.highlight) {
          console.log("插入---》", box.row, box.col)
          this.insertPool(box)
        }

        // }
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
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      const enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    const that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        const enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      const enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
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

    this.box.renderBoxData()
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver) return

    // this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
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
}
