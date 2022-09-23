import Sprite from '../base/sprite'

const BG_IMG_SRC = 'images/bg_home.webp'
const BG_WIDTH = window.innerWidth
const BG_HEIGHT = window.innerHeight

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, 0, 0, BG_WIDTH, BG_HEIGHT, false)
  }

  updateImgSrc(imgSrc) {
    this.imgSrc = imgSrc
  }
}
