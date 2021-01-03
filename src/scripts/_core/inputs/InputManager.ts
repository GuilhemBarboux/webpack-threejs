import debug from "@core/Debug"
import { EMPTY, from, fromEvent, merge, Observable } from "rxjs"
import {
  concatMap,
  distinctUntilChanged,
  filter,
  first,
  map,
  share,
  takeUntil,
  tap,
} from "rxjs/operators"
import { EventListenerOptions } from "rxjs/internal/observable/fromEvent"

enum MouseKeys {
  "leftMouse" = "leftMouse",
  "middleMouse" = "middleMouse",
  "rightMouse" = "rightMouse",
}

enum TouchKeys {
  "drag" = "drag",
  "drop" = "drop",
}

const MouseButtonKey = [
  MouseKeys.leftMouse,
  MouseKeys.middleMouse,
  MouseKeys.rightMouse,
]

interface InputEvent {
  event: string
  target: EventTarget
  options?: EventListenerOptions
}

interface InputValue {
  ev: Event
  type: string
  target: EventTarget
  x?: number
  y?: number
  key?: string
  touches?: TouchList
}

interface InputAction {
  type: string
  key?: string
  target?: EventTarget
}

interface InputActionMap {
  keyboard?: InputAction[]
  mouse?: InputAction[]
  touch?: InputAction[]
}

class InputManager {
  public keyboard: Observable<InputValue> = EMPTY
  public mouse: Observable<InputValue> = EMPTY
  public touch: Observable<InputValue> = EMPTY
  private readonly debug = debug && false

  // ---------------------------------------------------------------------------------------------
  // EVENTS
  // ---------------------------------------------------------------------------------------------
  public addKeyboard(...keyboardEvents: InputEvent[]) {
    this.keyboard = merge(
      ...keyboardEvents.map((ie) =>
        fromEvent<KeyboardEvent>(ie.target, ie.event, ie.options)
      )
    ).pipe(
      map((ev) => ({
        ev,
        type: ev.type,
        target: ev.target,
        key: ev.key,
      })),
      distinctUntilChanged((p, c) => c.key === p.key && c.type === p.type),
      share()
    )
  }

  public addMouse(...mouseEvents: InputEvent[]) {
    this.mouse = merge(
      ...mouseEvents.map((ie) =>
        fromEvent<MouseEvent>(ie.target, ie.event, ie.options)
      )
    ).pipe(
      map((ev) => ({
        ev,
        type: ev.type,
        target: ev.target,
        x: ev.clientX,
        y: ev.clientY,
        key: MouseButtonKey[ev.button],
      })),
      share()
    )
  }

  public addTouch(...touchTargets: EventTarget[]) {
    const mouseEventToCoordinate = (ev: MouseEvent) => {
      ev.preventDefault()
      return {
        ev,
        x: ev.clientX,
        y: ev.clientY,
      }
    }

    const touchEventToCoordinate = (ev: TouchEvent) => {
      ev.preventDefault()
      return {
        ev,
        x: ev.changedTouches[0].clientX,
        y: ev.changedTouches[0].clientY,
      }
    }

    // Events
    const starts = merge(
      merge(...touchTargets.map((t) => fromEvent(t, "mousedown"))).pipe(
        map(mouseEventToCoordinate)
      ),
      merge(...touchTargets.map((t) => fromEvent(t, "touchstart"))).pipe(
        map(touchEventToCoordinate)
      )
    )
    const moves = merge(
      fromEvent(window, "mousemove").pipe(map(mouseEventToCoordinate)),
      merge(...touchTargets.map((t) => fromEvent(t, "touchmove"))).pipe(
        map(touchEventToCoordinate)
      )
    )
    const ends = merge(
      fromEvent(window, "mouseup").pipe(map(mouseEventToCoordinate)),
      fromEvent(window, "touchend").pipe(map(touchEventToCoordinate))
    )

    // Drag
    const drags = starts.pipe(
      concatMap((dragStartEvent) =>
        moves.pipe(
          takeUntil(ends),
          map((dragEvent) => {
            const x = dragEvent.x - dragStartEvent.x
            const y = dragEvent.y - dragStartEvent.y
            return {
              ev: dragEvent.ev,
              x: x,
              y: y,
              key: TouchKeys["drag"],
            }
          })
        )
      )
      // tap(() => console.log("draggggss"))
    )

    // Drop
    const drops = starts.pipe(
      concatMap((dragStartEvent) =>
        ends.pipe(
          first(),
          map((dragEndEvent) => {
            const x = dragEndEvent.x - dragStartEvent.x
            const y = dragEndEvent.y - dragStartEvent.y
            return {
              ev: dragEndEvent.ev,
              x: x,
              y: y,
              key: TouchKeys["drop"],
            }
          })
        )
      )
    )

    this.touch = merge(drags, drops).pipe(
      map(({ ev, ...rest }) => ({
        ev,
        type: ev.type,
        target: ev.target,
        ...rest,
      })),
      share()
    )
  }

  // ---------------------------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------------------------
  public registerAction(
    name: string,
    actions: InputActionMap
  ): Observable<InputValue> {
    return merge(
      this.keyboardEventAction(actions.keyboard),
      this.mouseEventAction(actions.mouse),
      this.touchEventAction(actions.touch)
    ).pipe(
      tap(
        (v: InputValue) => this.debug && console.log("Event", name, v.type, v)
      )
    )
  }

  private static createEventFilter = (actions: InputAction[]) => (
    value: InputValue
  ) => {
    return actions.reduce(
      (acc, eventAction) =>
        acc ||
        (eventAction.type === value.type &&
          (!eventAction.target || eventAction.target === value.target) &&
          (!eventAction.key || eventAction.key === value.key)),
      false
    )
  }

  public keyboardEventAction(
    keyboardActions: InputAction[] = []
  ): Observable<InputValue> {
    const keyboardFilter = InputManager.createEventFilter(keyboardActions)
    return this.keyboard.pipe(filter(keyboardFilter))
  }

  public mouseEventAction(
    mouseActions: InputAction[] = []
  ): Observable<InputValue> {
    const mouseFilter = InputManager.createEventFilter(mouseActions)
    return this.mouse.pipe(filter(mouseFilter))
  }

  public touchEventAction(
    touchActions: InputAction[] = []
  ): Observable<InputValue> {
    const touchFilter = InputManager.createEventFilter(touchActions)
    return this.touch.pipe(filter(touchFilter))
  }

  /*public readonly actionsObservable: { [index: string]: Observable<Event> }
  public readonly eventsObservable: Observable<Event>

  public keyboardObservables: Observable<KeyboardEvent>[] = []
  public mouseObservables: Observable<MouseEvent>[] = []

  constructor(...inputEvents: InputEvent[]) {
    inputEvents.forEach((ie) => {
      const eventNames =
        typeof ie.eventNames != "undefined" && ie.eventNames instanceof Array
          ? ie.eventNames
          : [ie.eventNames]

      switch (ie.device) {
        case InputDevices.keyboard:
          this.keyboardObservables.push(
            ...eventNames.map((en) => fromEvent<KeyboardEvent>(ie.target, en))
          )
          break
        case InputDevices.mouse:
          this.mouseObservables.push(
            ...eventNames.map((en) => fromEvent<MouseEvent>(ie.target, en))
          )
          break
        // TODO: add other devices
      }
    })

    this.eventsObservable = merge(
      ...this.keyboardObservables,
      ...this.mouseObservables
    )
  }

  public registerAction(id: string, action: InputActionMap) {
    this.actionsObservable[id] = this.eventsObservable.pipe(
      filter((Event) => action.types.indexOf(Event.type) >= 0),
      filter(
        (Event) => !action.targets || action.targets.indexOf(Event.target) >= 0
      )
    )

    this.actionsObservable[id].subscribe(action)
  }*/
}

export default InputManager
export { InputValue, MouseKeys, TouchKeys }
