import { between } from "@core/utils/math.utils"

class Joystick {
  public readonly element: HTMLElement
  public readonly radius: number

  constructor(el: HTMLElement) {
    this.element = el
    this.radius =
      (this.element.parentElement.offsetWidth - this.element.offsetWidth) / 2
  }

  update(x: number, y: number) {
    const angle = Math.atan2(x, y)
    const distance = Math.min(
      Math.sqrt(Math.pow(x * this.radius, 2) + Math.pow(y * this.radius, 2)),
      this.radius
    )
    const pos = {
      x: distance * Math.sin(angle),
      y: -distance * Math.cos(angle),
    }

    this.element.style.transform = `translate(
      ${-this.radius + pos.x}px,
      ${-this.radius + pos.y}px
    )`
  }
}

export default Joystick
