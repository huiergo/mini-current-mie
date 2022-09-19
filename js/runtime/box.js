import Sprite from '../base/sprite'

const BOX_IMG='images/enemy.png'
const BOX_WIDTH = 50
const BOX_HEIGHT=50

const layerList=[
  {
    row:3,
    column:4,
    x:0,//第一层 起始点x
    y:0,//第一层 起始点y
  },
  {
    row:2,
    column:2,
    x:BOX_WIDTH/2,
    y:BOX_HEIGHT/2
  }
]

const IMGTYPE={
  0: 'images/enemy.png',
  1:'images/bullet.png'
}
/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class Box extends Sprite {
  constructor(ctx) {
    super(BOX_IMG, BOX_WIDTH, BOX_HEIGHT)
    this.boxData=[]
    this.ctx=ctx
    this.generaterBoxData()
  }

  generaterBoxData(){
    layerList.map((layerItem, index)=>{
      let tempList=[]
      for(let i=0;i<layerItem.row;i++){
        for(let j=0;j<layerItem.column;j++){
          tempList.push({row:i, col:j, layer: index,x:i*BOX_WIDTH+layerItem.x,y:j*BOX_HEIGHT+layerItem.y,imgType:IMGTYPE[index]})
        }
      }
      this.boxData.push(tempList)
    })
  }

  renderBoxData(){
    for(let i=0;i<this.boxData.length;i++){
      let currentLayerData=this.boxData[i]
      for(let j=0;j<currentLayerData.length;j++){
        let item=currentLayerData[j]
        let img=new Image()
        img.src=item.imgType
        this.ctx.drawImage(img, item.x,item.y,this.width,this.height)
      }
    }
  }
}
