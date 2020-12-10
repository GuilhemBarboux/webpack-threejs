import * as THREE from "three"
import glslify from "glslify"
import AsyncPreloader from "async-preloader"
import ModelLoader from "./objects/ModelLoader"

import {
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
  SMAAEffect,
  SMAAImageLoader,
  VignetteEffect,
} from "postprocessing"

import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"

export default class WebGLView {
  constructor(app) {
    this.app = app
    this.debug = true
  }

  async init() {
    this.initLoader()
    this.initThree()
    await this.initObject()
    this.initControls()
    this.initPostProcessing()
  }

  initThree() {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    this.camera.position.z = 50

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    this.clock = new THREE.Clock()
  }

  // Interface between async preloader and threejs
  initLoader() {
    this.manager = new THREE.LoadingManager()
    this.manager.setURLModifier((url) => {
      if (this.debug) console.log("Manager", "load :", url)
      return URL.createObjectURL(AsyncPreloader.items.get(url))
    })
    this.loader = new ModelLoader(this.manager)
  }

  initControls() {
    this.trackball = new TrackballControls(
      this.camera,
      this.renderer.domElement
    )
    this.trackball.rotateSpeed = 2.0
    this.trackball.enabled = true
  }

  async initObject() {
    const geometry = new THREE.IcosahedronBufferGeometry(2, 1)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0.2, 0.2, 1) },
      },
      vertexShader: glslify(require("../../shaders/default.vert")),
      fragmentShader: glslify(require("../../shaders/default.frag")),
      wireframe: true,
    })

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 200, 0)
    this.scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xffffff)
    dirLight.position.set(0, 200, 100)
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 180
    dirLight.shadow.camera.bottom = -100
    dirLight.shadow.camera.left = -120
    dirLight.shadow.camera.right = 120
    this.scene.add(dirLight)

    // FBX model
    this.fbx = await this.loader.loadFBX("goal-model")
    this.fbx.scale.set(2, 2, 2)
    this.fbx.position.set(25, 0, 0)

    // GLTF model
    this.gltf = await this.loader.loadGLTF("boombox")
    this.gltf.scene.scale.set(100, 100, 100)

    // Geometry
    this.object3D = new THREE.Mesh(geometry, material)
    this.object3D.position.set(-25, 0, 0)

    this.scene.add(this.object3D, this.fbx, this.gltf.scene)
  }

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer, {
      frameBufferType: THREE.HalfFloatType,
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

  resize(vw, vh) {
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
