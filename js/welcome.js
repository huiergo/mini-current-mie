import Music from './runtime/music'

import Main from './main'

import BackGround from './runtime/background'

const ctx = canvas.getContext('2d')

/**
 * 游戏主函数
 */
export default class WelCome {
    constructor() {
        this.aniId = 0

        this.joinGame()
    }

    joinGame() {
        canvas.removeEventListener(
            'touchend',
            this.touchEnd
        )

        this.touchEnd = this.touchEnd.bind(this)
        canvas.addEventListener('touchend', this.touchEnd)

        this.bg = new BackGround(ctx)

        this.music = new Music()
        this.music.playBgm('audio/bgm_home.mp3')

        this.bindLoop = this.loop.bind(this)
        this.hasEventBind = false

        // 清除上一局的动画
        window.cancelAnimationFrame(this.aniId)

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }

    // 实现游戏帧循环
    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.bg.updateImgSrc('images/bg_login.jpg')
        this.bg.drawToCanvas(ctx)
        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }

    touchEnd(e) {
        e.preventDefault()

        canvas.removeEventListener(
            'touchend',
            this.touchEnd
        )

        window.cancelAnimationFrame(this.aniId)



        setTimeout(() => {
            new Main()
        }, 100);
    }
}


