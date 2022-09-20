import Sprite from './sprite'
import DataCenter from '../dataCenter'

const __ = {
  timer: Symbol('timer'),
}

/**
 * 简易的帧动画类实现
 */
export default class Animation extends Sprite {
  constructor(imgSrc, x, y, width, height) {
    super(imgSrc, x, y, width, height)
    // add: 
    this.dataCenter = new DataCenter()
    // 当前动画是否播放中
    this.isPlaying = false

    // add:
    this.isStart = false

    // 动画是否需要循环播放
    this.loop = false

    // 每一帧的时间间隔
    this.interval = 1000 / 60

    // 帧定时器
    this[__.timer] = null

    // 当前播放的帧
    this.index = -1

    // 总帧数
    this.count = 0

    // 帧图片集合
    this.imgList = []

    /**
     * 推入到全局动画池里面
     * 便于全局绘图的时候遍历和绘制当前动画帧
     */
    this.dataCenter.animations.push(this)
  }

  /**
   * 初始化帧动画的所有帧
   * 为了简单，只支持一个帧动画
   */
  initFrames(imgList) {
    imgList.forEach((imgSrc) => {
      const img = new Image()
      img.src = imgSrc

      this.imgList.push(img)
    })

    this.count = imgList.length
  }

  // 将播放中的帧绘制到canvas上
  aniRender(ctx) {
    ctx.drawImage(
      this.imgList[this.index],
      this.x,
      this.y,
      this.width * 1.2,
      this.height * 1.2
    )
  }

  // 播放预定的帧动画
  playAnimation(index = 0, loop = false) {
    // 动画播放的时候精灵图不再展示，播放帧动画的具体帧
    this.visible = false

    // add: attention:
    this.isStart = true

    this.isPlaying = true
    this.loop = loop

    this.index = index

    if (this.interval > 0 && this.count) {
      this[__.timer] = setInterval(
        this.frameLoop.bind(this),
        this.interval
      )
    }
  }

  // 停止帧动画播放
  stop() {
    console.log("stop回调了m")
    this.isPlaying = false

    if (this[__.timer]) clearInterval(this[__.timer])
  }

  // 帧遍历
  frameLoop() {
    this.index++

    if (this.index > this.count - 1) {
      if (this.loop) {
        this.index = 0
      } else {
        this.index--
        this.stop()
      }
    }
  }
}
