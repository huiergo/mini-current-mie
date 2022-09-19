
// let item = {
//     row: i + 1,
//     col: j + 1,
//     layer: index,
//     x: j * BOX_WIDTH + layerItem.x,
//     y: i * BOX_HEIGHT + layerItem.y,
//     img: IMGTYPE[index],
//     disabledImg: DISABLED_IMGTYPE[index],
//     width: BOX_WIDTH,
//     height: BOX_WIDTH,
//     highlight: true,
//     hidden: false
// }

export default class BoxInfo {
    constructor(props) {
        const { row, col, layer, x, y, img, disabledImg, width, height, hidden = false, elementType = 0 } = props
        console.log('---->boxInfo', row, col, layer, x, y, img, disabledImg, width, height, hidden)
        this.layer = layer
        this.row = row
        this.col = col
        this.x = x
        this.y = y
        this.img = img
        this.disabledImg = disabledImg
        this.width = width
        this.height = height
        this.hidden = hidden
        this.highlight = true


        this.elementType = elementType
        // this.ids = ids
        this.targetX = x
        this.targetY = y
        this.speedX = 0
        this.speedY = 0
        this.boomCount = 0
        this.hidden = false
        this.remove = false
    }

    setTargetPoint(x, y) {
        this.targetX = x
        this.targetY = y
    }

    setVelocity(speedX, speedY) {
        this.speedX = speedX
        this.speedY = speedY
    }

    setBoomCount(boomCount) {
        this.boomCount = boomCount
    }

    setHidden(hidden) {
        this.hidden = hidden
    }

    setRemove(remove) {
        this.remove = remove
    }
}