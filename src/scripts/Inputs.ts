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
import Joystick from "@core/inputs/Joystick"

class Inputs extends InputManager {
  public readonly onJump: Observable<boolean>
  public readonly onMove: Observable<{ x: number; y: number }>
  public readonly onRun: Observable<boolean>

  // HTML elements
  private readonly joystick: Joystick

  constructor(root: EventTarget = document) {
    super()

    // HtmlElements
    this.joystick = new Joystick(document.getElementById("joystick"))

    // Devices events you need to register
    this.addKeyboard(
      { event: "keydown", target: document },
      { event: "keyup", target: document }
    )

    this.addMouse(
      { event: "mousedown", target: root },
      { event: "mouseup", target: root },
      { event: "click", target: root },
      { event: "contextmenu", target: root }
    )

    this.addTouch(this.joystick.element)

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
        { type: "touchmove", target: this.joystick.element, key: "drag" },
        { type: "touchend", target: this.joystick.element, key: "drop" },
        { type: "mousemove", target: this.joystick.element, key: "drag" },
        { type: "mouseup", target: this.joystick.element, key: "drop" },
      ],
    }).pipe(
      scan(
        (direction: { x: number; y: number }, value: InputValue) => {
          let x = direction.x,
            y = direction.y

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
            x = value.x / this.joystick.radius
            y = -value.y / this.joystick.radius
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
      tap(({ x, y }) => this.joystick.update(x, y))
    )

    this.mouse.subscribe((value) => {
      if (value.type === "contextmenu") value.ev.preventDefault()
    })
  }
}

export default Inputs
