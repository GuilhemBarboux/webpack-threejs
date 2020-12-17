import { Scene } from "three"

require("../styles/main")

import WebGLView from "./render/WebGLView"
import { IWebGLObject } from "./render/IWebGLObject"
import GUIView from "./gui/GUIView"
import BaseScene from "@core/objects/BaseScene"
import Machine from "@core/machine/Machine"
import Inputs from "./Inputs"

// Config scene available (First load by default)
const sceneList: { [index: string]: string } = {
  scene1: "./objects/scene1",
}

export default class App {
  private el: HTMLElement
  private webgl: WebGLView
  private gui: GUIView
  private raf: number
  private handlerAnimate: any
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

  async load() {}

  async loadScene(id: string = "scene1", reset: boolean = false) {
    if ((!this.scenes[id] || reset) && sceneList[id]) {
      const pScene = await import(/* webpackMode: "lazy-once" */ sceneList[id])
      this.scenes[id] = new pScene.default()
    }

    this.currentScene = this.scenes[id]

    if (this.currentScene) {
      await this.currentScene.load()
      this.webgl.setScene(this.currentScene)
    }
  }

  initInputs() {
    this.inputs = new Inputs(this.webgl.renderer.domElement)
    this.inputs.onJump.subscribe((jump) => {
      console.log("jump", jump)
    })

    this.inputs.onMove.subscribe(({ x, y }) => {
      console.log("move", x, y)
    })

    this.inputs.onRun.subscribe((run) => {
      console.log("run", run)
    })
  }

  initMachine() {
    this.machine = new Machine()
  }

  initWebGL() {
    this.webgl = new WebGLView(this)
    this.el.appendChild(this.webgl.renderer.domElement)
  }

  initPhysics() {}

  initGUI() {
    this.gui = new GUIView(this)
  }

  initListeners() {
    this.handlerAnimate = this.animate.bind(this)

    window.addEventListener("resize", this.resize.bind(this))
    window.addEventListener("keyup", this.keyup.bind(this))
  }

  animate() {
    this.update()
    this.draw()

    this.raf = requestAnimationFrame(this.handlerAnimate)
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update() {
    // if (this.machine) this.machine.currentState.onUpdate()
    if (this.currentScene) this.currentScene.update()
    if (this.gui.stats) this.gui.stats.begin()
    if (this.webgl) this.webgl.update()
  }

  draw() {
    if (this.webgl) this.webgl.draw()
    if (this.gui.stats) this.gui.stats.end()
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize() {
    const vw = this.el.offsetWidth || window.innerWidth
    const vh = this.el.offsetHeight || window.innerHeight

    if (this.webgl) this.webgl.resize(vw, vh)
  }

  keyup(e: any) {
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
