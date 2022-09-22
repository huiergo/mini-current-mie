const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {

  constructor() {
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 - 100 + 255
    }
  }

  renderGameScore(ctx, score) {
    ctx.fillStyle = '#ffffff'
    ctx.font = '50px Arial'

    ctx.fillText(
      score,
      screenWidth / 2,
      300
    )
  }

  renderGameEnd(ctx, dataCenter) {
    let isGameFinish = dataCenter.gameFinish
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = '#ffffff'
    ctx.font = '20px Arial'

    ctx.fillText(
      isGameFinish ? `通过第${dataCenter.level}关` : '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      `得分: ${dataCenter.score}`,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      isGameFinish ? '下一关' : '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )
  }
}
