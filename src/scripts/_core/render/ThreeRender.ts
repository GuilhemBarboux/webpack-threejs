import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  HalfFloatType,
  Mesh,
  LoadingManager,
  IcosahedronBufferGeometry,
  ShaderMaterial,
  Color,
  HemisphereLight,
  DirectionalLight,
  MeshBasicMaterial,
} from "three"
// import glslify from "glslify"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"
import {
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
  SMAAEffect,
  VignetteEffect,
} from "postprocessing"
import AsyncPreloader from "async-preloader"
// import ThreeLoader from "@core/utils/ThreeLoader"
import BaseRender from "@core/render/BaseRender"
import SceneManager from "@core/SceneManager"
import ThreeLoader from "@core/utils/ThreeLoader"

export default class ThreeRender extends BaseRender {
  private readonly debug: boolean = true

  // Compositions
  private sceneManager: SceneManager
  public trackball: TrackballControls

  // Three components
  private scene: Scene
  private camera: PerspectiveCamera
  public renderer: WebGLRenderer
  private composer: any
  private clock: Clock

  // Configuration
  private fovHeight: number
  private fovWidth: number

  constructor(sceneManager: SceneManager) {
    super()

    this.sceneManager = sceneManager
    this.sceneManager.onSceneChange.subscribe((scene) => {
      this.onSceneChange(scene.object3D)
    })

    // Init steps
    this.initLoader()
    this.initThree()
    this.initControls()
  }

  initLoader(): void {
    const manager = new LoadingManager()
    manager.setURLModifier((url: string) => {
      return URL.createObjectURL(AsyncPreloader.items.get(url))
    })
    ThreeLoader.setManager(manager)
  }

  initThree(): void {
    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    this.camera.position.z = 50

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })

    this.clock = new Clock()
  }

  initControls(): void {
    window.addEventListener("keyup", this.keyup.bind(this))
    this.trackball = new TrackballControls(
      this.camera,
      this.renderer.domElement
    )
    this.trackball.rotateSpeed = 2.0
    this.trackball.enabled = true
  }

  onSceneChange(scene: Scene = new Scene()): void {
    this.scene = scene
    this.composer = new EffectComposer(this.renderer, {
      frameBufferType: HalfFloatType,
    })
    this.composer.enabled = false

    const smaaSrch = AsyncPreloader.items.get("smaa-search")
    const smaaArea = AsyncPreloader.items.get("smaa-area")

    const smaaEffect = new SMAAEffect(smaaSrch, smaaArea)
    smaaEffect.edgeDetectionMaterial.setEdgeDetectionThreshold(0.05)

    const noiseEffect = new NoiseEffect({ premultiply: true })
    const vignetteEffect = new VignetteEffect()

    const renderPass = new RenderPass(this.scene, this.camera)
    const effectPass = new EffectPass(
      this.camera,
      noiseEffect,
      vignetteEffect,
      smaaEffect
    )

    noiseEffect.blendMode.opacity.value = 0.75

    this.composer.addPass(renderPass)
    this.composer.addPass(effectPass)
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update(): void {
    if (this.trackball) this.trackball.update()
  }

  draw(): void {
    if (this.scene) {
      const delta = this.clock.getDelta()
      if (this.composer && this.composer.enabled) this.composer.render(delta)
      else this.renderer.render(this.scene, this.camera)
    }
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------
  resize(vw: number, vh: number): void {
    if (!this.renderer) return
    this.camera.aspect = vw / vh
    this.camera.updateProjectionMatrix()

    this.fovHeight =
      2 *
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
      this.camera.position.z
    this.fovWidth = this.fovHeight * this.camera.aspect

    this.renderer.setSize(vw, vh)

    if (this.composer) this.composer.setSize(vw, vh)
    if (this.trackball) this.trackball.handleResize()
  }

  keyup(e: KeyboardEvent): void {
    // h
    if (e.keyCode == 72) {
      if (this.trackball) this.trackball.reset()
    }
  }
}
