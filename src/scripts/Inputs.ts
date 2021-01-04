import InputManager, { InputValue, MouseKeys } from "@core/inputs/InputManager"
import { fromEvent, Observable } from "rxjs"
import { between } from "@core/utils/math.utils"
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  scan,
  tap,
} from "rxjs/operators"
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

    this.addTouch(this.joystick)

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
      filter((value) => value.type === "keydown" || value.type === "mousedown"),
      mapTo(true)
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
      filter((value) => value.type === "keydown" || value.type === "mousedown"),
      mapTo(true)
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
      touch: [
        { type: "touchmove", target: this.joystick, key: "drag" },
        { type: "touchend", target: this.joystick, key: "drop" },
        { type: "mousemove", target: this.joystick, key: "drag" },
        { type: "mouseup", target: this.joystick, key: "drop" },
      ],
    }).pipe(
      scan(
        (direction: { x: number; y: number }, value: InputValue) => {
          let x = direction.x,
            y = direction.y

          const size = 50

          if (value.type === "keydown") {
            if (value.key === "ArrowLeft") x -= 1
            if (value.key === "ArrowRight") x += 1
            if (value.key === "ArrowUp") y += 1
            if (value.key === "ArrowDown") y -= 1
          }

          if (value.type === "keyup") {
            if (value.key === "ArrowLeft") x += 1
            if (value.key === "ArrowRight") x -= 1
            if (value.key === "ArrowUp") y -= 1
            if (value.key === "ArrowDown") y += 1
          }

          if (value.key === "drag") {
            const tx = between(-size, value.x, size)
            const ty = between(-size, value.y, size)
            x = tx / size
            y = -ty / size
            console.log(between(x, -1))
          }

          if (value.key === "drop") {
            x = 0
            y = 0
          }

          return {
            x: between(x, -1),
            y: between(y, -1),
          }
        },
        { x: 0, y: 0 }
      ),
      map((direction) => ({
        x: direction.x,
        y: direction.y,
      }))
      /*scan(
        (direction, value) => ({
          x: Math.max(Math.min(direction.x + value.x, 1), -1),
          y: Math.max(Math.min(direction.y + value.y, 1), -1),
        }),
        { x: 0, y: 0 }
      )*/
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
