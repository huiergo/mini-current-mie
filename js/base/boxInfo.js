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
        this.canClick = true


        this.elementType = elementType
        // this.ids = ids
        this.targetX = x
        this.targetY = y
        this.speedX = 0
        this.speedY = 0
        this.boomCount = 0
        this.hidden = false
        this.fallDown = false

        this.dispear = false
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


    setDispear(dispear) {
        this.dispear = dispear
    }

    setFallDown(fallDown) {
        this.fallDown = fallDown
    }
}