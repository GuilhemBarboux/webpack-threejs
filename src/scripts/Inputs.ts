import InputManager, { MouseKeys } from "@core/inputs/InputManager"
import { fromEvent, Observable } from "rxjs"
import { distinctUntilChanged, filter, map, scan, tap } from "rxjs/operators"
import isTouch from "@core/utils/touch"

class Inputs extends InputManager {
  public readonly onJump: Observable<boolean>
  public readonly onMove: Observable<{ x: number; y: number }>
  public readonly onRun: Observable<boolean>

  private readonly btn: HTMLElement
  private readonly joystick: HTMLElement

  constructor(root: EventTarget = document) {
    super()

    // HtmlElements
    this.btn = document.getElementById("btn")
    this.joystick = document.getElementById("joystick")
    console.log(this.joystick)

    // Devices events you need
    this.addKeyboard(
      { event: "keydown", target: document },
      { event: "keyup", target: document }
    )

    this.addMouse(
      { event: "mousedown", target: root },
      { event: "mouseup", target: root },
      { event: "click", target: root },
      { event: "click", target: this.btn },
      { event: "contextmenu", target: root }
    )

    /*if (isTouch()) {
      this.addTouch({ event: "touchmove", target: this.joystick })
    }*/

    // Actions events you need
    this.onJump = this.registerAction("jump", {
      keyboard: [
        { type: "keydown", key: " " },
        { type: "keyup", key: " " },
      ],
      mouse: [
        { type: "mousedown", key: MouseKeys.leftMouse },
        { type: "mouseup", key: MouseKeys.leftMouse },
      ],
    }).pipe(
      map((value) => value.type === "keydown" || value.type === "mousedown"),
      distinctUntilChanged()
    )

    this.onRun = this.registerAction("run", {
      keyboard: [
        { type: "keydown", key: "Shift" },
        { type: "keyup", key: "Shift" },
      ],
      mouse: [
        { type: "mousedown", key: MouseKeys.rightMouse },
        { type: "mouseup", key: MouseKeys.rightMouse },
      ],
    }).pipe(
      map((value) => value.type === "keydown" || value.type === "mousedown"),
      distinctUntilChanged()
    )

    this.onMove = this.registerAction("move", {
      keyboard: [
        { type: "keydown", key: "ArrowUp" },
        { type: "keyup", key: "ArrowUp" },
        { type: "keydown", key: "ArrowDown" },
        { type: "keyup", key: "ArrowDown" },
        { type: "keydown", key: "ArrowLeft" },
        { type: "keyup", key: "ArrowLeft" },
        { type: "keydown", key: "ArrowRight" },
        { type: "keyup", key: "ArrowRight" },
      ],
      touch: [{ type: "touchmove", target: this.joystick }],
    }).pipe(
      map((value) => {
        let x = 0,
          y = 0

        if (value.type === "keydown") {
          if (value.key === "ArrowLeft") y -= 1
          if (value.key === "ArrowRight") y += 1
          if (value.key === "ArrowUp") x += 1
          if (value.key === "ArrowDown") x -= 1
        }

        if (value.type === "keyup") {
          if (value.key === "ArrowLeft") y += 1
          if (value.key === "ArrowRight") y -= 1
          if (value.key === "ArrowUp") x -= 1
          if (value.key === "ArrowDown") x += 1
        }

        if (value.type === "touchmove") {
          console.log("touch", value)
        }

        return { x, y }
      }),
      scan(
        (direction, value) => ({
          x: Math.max(Math.min(direction.x + value.x, 1), -1),
          y: Math.max(Math.min(direction.y + value.y, 1), -1),
        }),
        { x: 0, y: 0 }
      )
    )

    this.mouse.subscribe((value) => {
      if (value.type === "contextmenu") value.ev.preventDefault()
    })
    /*root.addEventListener("touchmove", (e) => {
      console.log(e)
    })*/
  }
}

export default Inputs
