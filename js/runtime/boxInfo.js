import Animation from "../base/animation"

export default class BoxInfo extends Animation {
    constructor(row, col, layer, x, y, img, width, height, elementType) {
        super(img, x, y, width, height)
        this.layer = layer
        this.row = row
        this.col = col

        this.elementType = elementType

        this.targetX = x
        this.targetY = y

        this.speedX = 0
        this.speedY = 0
        this.fallDown = false
        this.visible = true
        this.canClick = true
        this.willRemove = false

        // attention:
        this.dispear = false
        this.initExplosionAnimation()
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

    setVisible(visible) {
        this.visible = visible
    }


    setDispear(dispear) {
        this.dispear = dispear
    }

    setFallDown(fallDown) {
        this.fallDown = fallDown
    }

    updatePosition(x, y) {
        this.x = x
        this.y = y
    }
    // add: 可以用来更新 disabledImg
    updateImage(imgSrc) {
        this.img = imgSrc
    }

    // 预定义爆炸的帧动画
    initExplosionAnimation() {
        const frames = []

        const EXPLO_IMG_PREFIX = 'images/explosion'
        const EXPLO_FRAME_COUNT = 10

        for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
            frames.push(`${EXPLO_IMG_PREFIX + (i + 1)}.png`)
        }
        this.initFrames(frames)
    }
}