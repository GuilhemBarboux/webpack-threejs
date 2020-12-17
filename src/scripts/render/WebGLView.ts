import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  IcosahedronBufferGeometry,
  ShaderMaterial,
  Color,
  Mesh,
  HemisphereLight,
  DirectionalLight,
  LoadingManager,
  HalfFloatType,
} from "three"
import AsyncPreloader from "async-preloader"
import WebGLLoader from "./WebGLLoader"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"

const glslify = require("glslify")
const {
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
  SMAAEffect,
  VignetteEffect,
} = require("postprocessing")

export default class WebGLView {
  private app: any
  private readonly debug: boolean = true
  private scene: Scene
  private camera: PerspectiveCamera
  private clock: Clock
  private object3D: Mesh<IcosahedronBufferGeometry, ShaderMaterial>
  private manager: LoadingManager
  private loader: WebGLLoader
  private composer: any
  private fovHeight: number
  private fovWidth: number

  public renderer: WebGLRenderer
  public trackball: TrackballControls

  constructor(app: any) {
    this.app = app

    // Init steps
    this.initThree()
    // this.initControls()
  }

  initThree() {
    this.scene = new Scene()

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

  initControls() {
    this.trackball = new TrackballControls(
      this.camera,
      this.renderer.domElement
    )
    this.trackball.rotateSpeed = 2.0
    this.trackball.enabled = true
  }

  setScene(scene: Scene = new Scene()) {
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

  /*async loadScene() {
    // Geometry
    const geometry = new IcosahedronBufferGeometry(2, 1)

    const material = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color(0.2, 0.2, 1) },
      },
      vertexShader: glslify(require("../../shaders/default.vert")),
      fragmentShader: glslify(require("../../shaders/default.frag")),
      wireframe: true,
    })
    this.object3D = new Mesh(geometry, material)
    this.object3D.position.set(-25, 0, 0)

    // Lights
    const hemiLight = new HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 200, 0)

    const dirLight = new DirectionalLight(0xffffff)
    dirLight.position.set(0, 200, 100)
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 180
    dirLight.shadow.camera.bottom = -100
    dirLight.shadow.camera.left = -120
    dirLight.shadow.camera.right = 120

    // Model Loader
    this.manager = new LoadingManager()
    this.manager.setURLModifier((url: string) => {
      if (this.debug) console.log("Manager", "load :", url)
      return URL.createObjectURL(AsyncPreloader.items.get(url))
    })
    this.loader = new ModelLoader(this.manager)

    // FBX model
    const fbx = await this.loader.loadFBX("goal-model")
    fbx.scale.set(2, 2, 2)
    fbx.position.set(25, 0, 0)

    // GLTF model
    const gltf = await this.loader.loadGLTF("boombox")
    gltf.scene.scale.set(100, 100, 100)

    this.scene.add(this.object3D, fbx, gltf.scene, hemiLight, dirLight)
  }*/

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update() {
    if (this.trackball) this.trackball.update()
  }

  draw() {
    const delta = this.clock.getDelta()

    if (this.composer && this.composer.enabled) this.composer.render(delta)
    else this.renderer.render(this.scene, this.camera)
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize(vw: number, vh: number) {
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
}
