import WebGLView from "@core/render/WebGLView"
import Machine from "@core/machine/Machine"

import Inputs from "./Inputs"
import GUIView from "./gui/GUIView"
import { sceneList } from "./Config"
import SceneManager from "@core/SceneManager"

export default class App extends SceneManager {
  private el: HTMLElement
  private webgl: WebGLView
  private gui: GUIView
  private raf: number
  private handlerAnimate: () => void
  private machine: Machine
  private inputs: Inputs

  constructor() {
    super(sceneList)

    // Html
    this.el = document.querySelector(".container")

    // Init
    this.initMachine()
    this.initWebGL()
    this.initPhysics()
    this.initGUI()
    this.initListeners()
    this.initInputs()

    // Run
    this.resize()
    this.animate()
  }

  async start(): Promise<void> {
    this.current = await this.loadScene()
    this.webgl.setScene(this.current)
  }

  // ---------------------------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------------------------
  initInputs(): void {
    this.inputs = new Inputs(this.webgl.renderer.domElement)
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

  initMachine(): void {
    this.machine = new Machine()
  }

  initWebGL(): void {
    this.webgl = new WebGLView(this)
    this.el.appendChild(this.webgl.renderer.domElement)
  }

  initPhysics(): void {
    // TODO
  }

  initGUI(): void {
    this.gui = new GUIView(this)
  }

  initListeners(): void {
    this.handlerAnimate = this.animate.bind(this)

    window.addEventListener("resize", this.resize.bind(this))
    window.addEventListener("keyup", this.keyup.bind(this))
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
    if (this.current) this.current.update()
    if (this.gui.stats) this.gui.stats.begin()
    if (this.webgl) this.webgl.update()
  }

  draw(): void {
    if (this.webgl) this.webgl.draw()
    if (this.gui.stats) this.gui.stats.end()
  }

  // ---------------------------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------------------------
  resize(): void {
    const vw = this.el.offsetWidth || window.innerWidth
    const vh = this.el.offsetHeight || window.innerHeight

    if (this.webgl) this.webgl.resize(vw, vh)
  }

  keyup(e: KeyboardEvent): void {
    // g or p
    if (e.keyCode == 71 || e.keyCode == 80) {
      if (this.gui) this.gui.toggle()
    }
    // h
    if (e.keyCode == 72) {
      if (this.webgl.trackball) this.webgl.trackball.reset()
    }
  }
}
