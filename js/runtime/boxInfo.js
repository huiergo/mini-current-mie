import Animation from "../base/animation"

export default class BoxInfo extends Animation {
    constructor(row, col, layer, targetX, targetY, img, width, height) {
        super(img, 0, 0, width, height)
        this.layer = layer
        this.row = row
        this.col = col

        this.elementType = 1

        this.targetX = targetX
        this.targetY = targetY

        this.speedX = 6
        this.speedY = 6

        //用于判断下层box是否可点
        this.fallDown = false

        //标识box即将被消除
        this.willRemove = false

        //标识box是否可点
        this.canClick = true

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


    setWillRemove(willRemove) {
        this.willRemove = willRemove
    }

    setFallDown(fallDown) {
        this.fallDown = fallDown
    }

    updatePosition(x, y) {
        this.x = x
        this.y = y
    }

    setElementType(elementType) {
        this.elementType = elementType
    }

    setImgSrc(imgSrc) {
        this.imgSrc = imgSrc
    }

    /**
     * 将精灵图绘制在canvas上
     */
    drawToCanvas(ctx) {
        if (!this.visible) return
        if (this.canClick) {
            this.img.src = `images/${this.elementType}_1.png`
        } else {
            this.img.src = `images/${this.elementType}_0.png`
        }

        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }

    // 预定义爆炸的帧动画
    initExplosionAnimation() {
        const frames = []

        const EXPLO_IMG_PREFIX = 'images/explosion'
        const EXPLO_FRAME_COUNT = 18

        for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
            frames.push(`${EXPLO_IMG_PREFIX + (i + 1)}.png`)
        }
        this.initFrames(frames)
    }
}