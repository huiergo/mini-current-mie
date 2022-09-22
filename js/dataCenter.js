import { generaterBoxData, judgeOverlay } from './utils/commonUtils'

let instance

/**
 * 全局状态管理器
 */
export default class DataCenter {
    constructor() {
        if (instance) return instance

        instance = this
        // 层区域： 二维数组 
        this.boxData = []

        // 层区域： 一维数组
        this.boxDataFlat = []

        // 插槽区域： 
        this.stack = []
        this.stackPoolLength = 7

        // boom
        this.animations = []
        this.score = 0

        //当前是第一关
        this.level = 1

        generaterBoxData(this.boxData, this.boxDataFlat, this.level)

        judgeOverlay(this.boxDataFlat)

        this.gameOver = false
        this.gameFinish = false

    }

    /**
     * 重置数据，重新开始
     */
    reset() {
        this.score = 0
        this.boxData = []
        this.animations = []
        this.boxDataFlat = []
        this.stack = []
        this.gameOver = false

        generaterBoxData(this.boxData, this.boxDataFlat, this.level)
        judgeOverlay(this.boxDataFlat)
    }

    /**
     * 移除上层覆盖物
     */
    updateLayer() {
        judgeOverlay(this.boxDataFlat)
    }

    updatePoint() {
        let isFlying = false
        this.stack.forEach(element => {
            if (element.targetY > element.y) {
                element.y = element.y + element.speedY
            } else {
                element.y = element.targetY
            }

            if (element.targetX > element.x) {
                element.x = Math.abs(element.x - element.targetX) < element.speedX ? element.targetX : element.x + element.speedX
            } else {
                element.x = Math.abs(element.x - element.targetX) <= element.speedX ? element.targetX : element.x - element.speedX
            }

            if (element.targetY != element.y) {
                isFlying = true
            }
        });
        return isFlying
    }

    updateBoomState() {
        let isBooming = false
        this.stack.forEach(element => {
            if (element.willRemove) {
                if (!element.alreadyPlay) {
                    element.playAnimation()
                    // this.music.playExplosion()
                }
            }
            if (element.isPlaying) {
                isBooming = true
            }
        });
        return isBooming
    }

    updateStackTargetPosition(basicSpeed) {
        this.stack.forEach((element, index) => {
            //设置目标位置
            element.setTargetPoint(index * element.width, 400)
            let distanceY = element.targetY - element.y
            let distanceX = Math.abs(element.targetX - element.x)

            // 此处根据Y下落速度计算X下落速度，防止X位移距离过小，导致Y轴速度过快
            let k = 0
            if (distanceX == 0) {
                k = 0
            } else {
                if (distanceY == 0) {
                    distanceY = 1
                }
                k = distanceX / distanceY
            }
            element.setVelocity(k * basicSpeed, basicSpeed)
        });
    }

    judgeGameOver() {
        //判断是否通关了
        this.score = 0
        let isAllFallDown = true
        this.gameFinish = true
        this.boxDataFlat.forEach(box => {
            if (!box.willRemove) {
                this.gameFinish = false
            }
            if (!box.fallDown) {
                isAllFallDown = false
            }
            if (box.willRemove) {
                this.score++;
            }
        })

        //判断是否gameOver
        let hasRemoveBox = false
        this.stack.forEach(box => {
            if (box.willRemove) {
                hasRemoveBox = true
            }
        })
        if (!hasRemoveBox && this.stack.length === 7) {
            this.gameOver = true
        }

        if (isAllFallDown && this.stack.length != 0 && !hasRemoveBox) {
            this.gameOver = true
        }
    }
}

