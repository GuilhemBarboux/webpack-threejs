import WebGLView from "@core/render/WebGLView"
import BaseScene from "@core/objects/BaseScene"
import Machine from "@core/machine/Machine"

import Inputs from "./Inputs"
import GUIView from "./gui/GUIView"

// Config scene available (First load by default)
const sceneList: { [index: string]: string } = {
  scene1: "./scenes/scene1/index",
}

export default class App {
  private el: HTMLElement
  private webgl: WebGLView
  private gui: GUIView
  private raf: number
  private handlerAnimate: () => void
  private scenes: { [index: string]: BaseScene } = {}
  private currentScene: BaseScene
  private machine: Machine
  private inputs: Inputs

  constructor() {
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

  async load(): Promise<void> {
    await this.loadScene()
  }

  async loadScene(id = "scene1", reset = false): Promise<void> {
    if ((!this.scenes[id] || reset) && sceneList[id]) {
      const pScene = await import(
        /* webpackMode: "lazy-once" */ `${sceneList[id]}`
      )
      console.log(pScene)
      // this.scenes[id] = new pScene.default()
    }

    console.log(this.scenes[id])

    this.currentScene = this.scenes[id]

    if (this.currentScene) {
      await this.currentScene.load()
      this.webgl.setScene(this.currentScene)
    }
  }

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

  animate(): void {
    this.update()
    this.draw()

    this.raf = requestAnimationFrame(this.handlerAnimate)
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update(): void {
    // if (this.machine) this.machine.currentState.onUpdate()
    if (this.currentScene) this.currentScene.update()
    // if (this.gui.stats) this.gui.stats.begin()
    if (this.webgl) this.webgl.update()
  }

  draw(): void {
    if (this.webgl) this.webgl.draw()
    // if (this.gui.stats) this.gui.stats.end()
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
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
