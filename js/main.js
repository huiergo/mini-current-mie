import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataCenter from './dataCenter';
import BackGround from './runtime/background'
import { swap, willRemoveSame, insertElementToArray } from './utils/commonUtils';

const ctx = canvas.getContext('2d')

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.beginGame()
  }

  restart() {
    this.dataCenter.level++
    this.dataCenter.reset()
  }

  beginGame() {
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
    this.music.playBgm()

    this.dataCenter = new DataCenter()

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
    let touchIndex = -1

    const area = this.gameinfo.btnArea
    console.log(area)

    if (touchX >= area.startX
      && touchX <= area.endX
      && touchY >= area.startY
      && touchY <= area.endY) {
      this.restart()
    }

    if (this.dataCenter.gameFinish || this.dataCenter.gameOver) {
      return
    }

    if (this.dataCenter.stack.length >= this.dataCenter.stackPoolLength) {
      return
    }

    this.dataCenter.boxDataFlat.forEach((box, index) => {
      let isXok = (touchX >= box.x && touchX <= box.x + box.width)
      let isYok = (touchY >= box.y && touchY <= box.y + box.height)
      if (isXok && isYok && box.canClick) {
        box.setFallDown(true)
        touchIndex = index
        this.insertPool(box)
        this.dataCenter.updateLayer()
      }
    })

    //将被点击的元素放置到数组末位，使其可以绘制到最上层
    if (touchIndex != -1) {
      swap(this.dataCenter.boxDataFlat, touchIndex, this.dataCenter.boxDataFlat.length - 1)
    }

  }

  insertPool(box) {
    //插入到相应位置
    insertElementToArray(this.dataCenter.stack, box)

    //标记删除元素
    willRemoveSame(this.dataCenter.stack, 3)

    //重新规整数据，赋值targetY，targetX
    this.dataCenter.updateStackTargetPosition(10)
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

  // 游戏逻辑更新主函数
  update() {
    if (this.dataCenter.gameOver) return
    let isFlying = false
    let isBooming = false

    // 两部操作，1 下落，2 平移
    isFlying = this.dataCenter.updatePoint()

    // playBoom
    if (!isFlying) {
      isBooming = this.dataCenter.updateBoomState()
    }

    //最终平移
    if (!isFlying && !isBooming) {
      this.dataCenter.stack = this.dataCenter.stack.filter(element => {
        return element.willRemove == false;
      });

      // 重新规整数据，赋值targetY，targetX
      this.dataCenter.updateStackTargetPosition(0.2)

      this.dataCenter.judgeGameOver()
    }
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //todo 绘制背景
    this.bg.drawToCanvas(ctx)

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

    //todo 绘制分数
    this.gameinfo.renderGameScore(ctx, this.dataCenter.score)

    // 游戏结束停止帧循环
    if (this.dataCenter.gameOver || this.dataCenter.gameFinish) {
      this.gameinfo.renderGameEnd(ctx, this.dataCenter)
    }
  }
}


