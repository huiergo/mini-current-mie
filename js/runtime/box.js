import Sprite from '../base/sprite'
import DataCenter from '../dataCenter'

const BOX_IMG = 'images/enemy.png'
const BOX_WIDTH = 50
const BOX_HEIGHT = 50



let atlas3 = new Image()
atlas3.src = 'images/boom.png'
const screenWidth = window.innerWidth
const scalX = (47 / 375) * screenWidth
const scalY = scalX
/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class Box extends Sprite {
  constructor(ctx) {
    super(BOX_IMG, BOX_WIDTH, BOX_HEIGHT)
    this.ctx = ctx
    this.dataCenter = new DataCenter()
  }

  renderBoxData() {
    const item = this.dataCenter.boxDataFlat[i];
    let img = new Image()
    img.src = item.highlight ? item.img : item.disabledImg
    this.ctx.drawImage(img, item.x, item.y, this.width, this.height)
  }


  renderSelf(img, x, y, width, height) {
    this.ctx.drawImage(
      img,
      x, y, width, height
    )
  }

  renderBoom(x, y, screenX, screenY) {
    this.ctx.drawImage(
      atlas3,
      x, y + 5, 95, 82, screenX, screenY, scalX, scalY
    )
  }

}
