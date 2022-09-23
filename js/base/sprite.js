/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', x = 0, y = 0, width = 0, height = 0) {
    this.img = new Image()

    this.imgSrc = imgSrc

    this.width = width
    this.height = height

    this.x = x
    this.y = y

    this.canClick = true

    this.visible = true
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if (!this.visible) return
    this.img.src = this.imgSrc
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  /**
   * 绘制背景色
   */
  drawRoundRectColor(context, x, y, w, h, r) {  //绘制圆角矩形（纯色填充）
    context.save();
    if (this.canClick) {
      context.fillStyle = "#000";
      context.strokeStyle = '#000';
    } else {
      context.fillStyle = "#fff";
      context.strokeStyle = '#fff';
    }

    context.lineJoin = 'round';  //交点设置成圆角
    context.lineWidth = r;
    context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
    context.stroke();
    context.closePath();
  }
}
