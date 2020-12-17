import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { LoadingManager } from "three"

class LoaderDecorator {
  private loader: any

  constructor(Loader: any) {
    this.loader = Loader
  }

  async load(source: string, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      this.loader.load(source, resolve, onProgress, reject)
    })
  }
}

export default class WebGLLoader {
  private readonly manager: LoadingManager
  private readonly loaders: { [index: string]: any }

  constructor(manager = new LoadingManager()) {
    this.manager = manager
    this.loaders = {}
  }

  async loadFBX(source = "", onProgress = () => {}) {
    const loader = this.getLoader("FBX")
    return loader.load(source, onProgress)
  }

  async loadGLTF(source = "", onProgress = () => {}) {
    const loader = this.getLoader("GLTF")
    return loader.load(source, onProgress)
  }

  getLoader(type: string = "GLTF") {
    let loader = this.loaders[type]

    if (!loader) {
      if (type === "FBX") {
        loader = new LoaderDecorator(new FBXLoader(this.manager))
      } else {
        loader = new LoaderDecorator(new GLTFLoader(this.manager))
      }

      this.loaders[type] = loader
    }

    return loader
  }
}
