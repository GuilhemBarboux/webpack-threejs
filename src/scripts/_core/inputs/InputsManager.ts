import keycodes from "@core/utils/keycode"

interface Devices {
  keyboard?: boolean
  mouse?: boolean
  touch?: boolean
  gamepad?: boolean
}

enum InputType {
  "pointer" = "pointer",
  "leftMouse" = "leftMouse",
  "middleMouse" = "middleMouse",
  "rightMouse" = "rightMouse",
  "keyboard" = "keyboard",
}

interface InputEvent {
  value: any
  event: any
  type: InputType
  isDown?: boolean
}

abstract class InputsManager {
  public readonly inputs: { [index: string]: any }
  private mouseListeners: () => void
  private keyboardListeners: () => void

  protected constructor(
    props: Devices = {
      keyboard: true,
      mouse: true,
    }
  ) {
    if (props.mouse) this.addMouseListeners()
    if (props.keyboard) this.addKeyboardListeners()
  }

  abstract onEvent(event: InputEvent): void

  // ---------------------------------------------------------------------------------------------
  // MOUSE
  // ---------------------------------------------------------------------------------------------
  protected onMouseMove(e: MouseEvent) {
    const value = {
      x: e.clientX,
      y: e.clientY,
    }

    this.inputs[InputType.pointer] = {
      value,
    }

    this.onEvent({
      value,
      event: e,
      type: InputType.pointer,
    })
  }

  protected onMouseDown(e: MouseEvent) {
    const btn: InputType =
      e.button === 0
        ? InputType.leftMouse
        : e.button === 1
        ? InputType.middleMouse
        : InputType.rightMouse

    this.inputs[btn] = true

    this.onEvent({
      value: true,
      event: e,
      type: btn,
      isDown: true,
    })
  }

  protected onMouseUp(e: MouseEvent) {
    const btn: InputType =
      e.button === 0
        ? InputType.leftMouse
        : e.button === 1
        ? InputType.middleMouse
        : InputType.rightMouse

    this.inputs[btn] = false

    this.onEvent({
      value: false,
      event: e,
      type: btn,
      isDown: false,
    })
  }

  public addMouseListeners() {
    const mouseMoveListener = (e: MouseEvent) => this.onMouseMove(e)
    const mouseDownListener = (e: MouseEvent) => this.onMouseDown(e)
    const mouseUpListener = (e: MouseEvent) => this.onMouseUp(e)

    window.addEventListener("mousemove", mouseMoveListener)
    window.addEventListener("mousedown", mouseDownListener)
    window.addEventListener("mouseup", mouseUpListener)

    this.mouseListeners = () => {
      window.removeEventListener("mousemove", mouseMoveListener)
      window.removeEventListener("mousedown", mouseDownListener)
      window.removeEventListener("mouseup", mouseUpListener)
    }
  }

  public removeMouseListeners() {
    if (this.mouseListeners) this.mouseListeners()
  }

  // ---------------------------------------------------------------------------------------------
  // KEYBOARD
  // ---------------------------------------------------------------------------------------------
  static getKeyCode(e: KeyboardEvent): string {
    return e.key || keycodes[e.keyCode]
  }

  public onKeyDown(e: KeyboardEvent) {
    const code = InputsManager.getKeyCode(e)
    this.inputs[code] = true

    this.onEvent({
      value: true,
      event: e,
      type: InputType.keyboard,
      isDown: true,
    })
  }

  public onKeyUp(e: KeyboardEvent) {
    const code = InputsManager.getKeyCode(e)
    this.inputs[code] = false

    this.onEvent({
      value: false,
      event: e,
      type: InputType.keyboard,
      isDown: true,
    })
  }

  public addKeyboardListeners() {
    const keyDownListener = (e: KeyboardEvent) => this.onKeyDown(e)
    const keyUpListener = (e: KeyboardEvent) => this.onKeyUp(e)

    window.addEventListener("keydown", keyDownListener)
    window.addEventListener("keyup", keyUpListener)

    this.keyboardListeners = () => {
      window.removeEventListener("keydown", keyDownListener)
      window.removeEventListener("keyup", keyUpListener)
    }
  }

  public removeKeyboardListeners() {
    if (this.keyboardListeners) this.keyboardListeners()
  }
}

export default InputsManager
export { InputType, InputEvent }
