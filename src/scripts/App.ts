import SceneManager from "@core/SceneManager"
import { ThreeRender } from "@core/render"

import Inputs from "./Inputs"
import GUIView from "./gui/GUIView"
import { sceneList } from "@config"

export default class App extends SceneManager {
  private readonly container: HTMLElement
  private readonly handlerAnimate: () => void

  private raf: number

  private render: ThreeRender
  private gui: GUIView
  private inputs: Inputs

  constructor() {
    super(sceneList)

    // Html
    this.container = document.querySelector(".container")

    // Handlers
    this.handlerAnimate = this.animate.bind(this)

    // Core
    this.initRender()
    this.initPhysics()
    this.initGUI()
    // this.initInputs()

    // Others
    this.initListeners()

    // Run
    this.resize()
    this.animate()
  }

  async start(): Promise<void> {
    this.current = await this.loadScene()
  }

  // ---------------------------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------------------------
  initInputs(): void {
    this.inputs = new Inputs(this.container)

    this.inputs.onJump.subscribe((jump: boolean) => {
      console.log("jump", jump)
    })

    this.inputs.onMove.subscribe(({ x, y }: { x: number; y: number }) => {
      console.log("move", x, y)
    })

    this.inputs.onRun.subscribe((run: boolean) => {
      console.log("run", run)
    })
  }

  initRender(): void {
    this.render = new ThreeRender(this)
    this.container.appendChild(this.render.renderer.domElement)
  }

  initPhysics(): void {
    // TODO
  }

  initGUI(): void {
    this.gui = new GUIView(this)
  }

  initListeners(): void {
    window.addEventListener("resize", this.resize.bind(this))
  }

  // ---------------------------------------------------------------------------------------------
  // Updates
  // ---------------------------------------------------------------------------------------------
  animate(): void {
    this.update()
    this.draw()

    this.raf = requestAnimationFrame(this.handlerAnimate)
  }

  update(): void {
    // if (this.machine) this.machine.currentState.onUpdate()
    if (this.current) {
      this.current.updatePhysic()
      this.current.updateRender()
    }

    if (this.gui.stats) this.gui.stats.begin()
    if (this.render) this.render.update()
  }

  draw(): void {
    if (this.render) this.render.draw()
    if (this.gui.stats) this.gui.stats.end()
  }

  // ---------------------------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------------------------
  resize(): void {
    const vw = this.container.offsetWidth || window.innerWidth
    const vh = this.container.offsetHeight || window.innerHeight

    if (this.render) this.render.resize(vw, vh)
  }

  keyup(e: KeyboardEvent): void {
    // g or p
    if (e.keyCode == 71 || e.keyCode == 80) {
      if (this.gui) this.gui.toggle()
    }
  }
}
