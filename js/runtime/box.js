import Sprite from '../base/sprite'
import DataCenter from '../dataCenter'

const BOX_IMG = 'images/enemy.png'
const BOX_WIDTH = 50
const BOX_HEIGHT = 50

const layerList = [
  {
    row: 2,
    column: 2,
    x: 0,//第一层 起始点x
    y: 0,//第一层 起始点y
  },
  {
    row: 1,
    column: 1,
    x: BOX_WIDTH / 2,
    y: BOX_HEIGHT / 2
  }
]

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
    for (let i = 0; i < this.dataCenter.boxDataFlat.length; i++) {
      const item = this.dataCenter.boxDataFlat[i];
      let img = new Image()
      img.src = item.highlight? item.img:item.disabledImg
      this.ctx.drawImage(img, item.x, item.y, this.width, this.height)
    }
  }
}
