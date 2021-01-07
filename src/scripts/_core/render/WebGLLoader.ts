import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { Group, LoadingManager } from "three"

class LoaderDecorator {
  private loader: FBXLoader | GLTFLoader

  constructor(Loader: FBXLoader | GLTFLoader) {
    this.loader = Loader
  }

  async load(source: string, onProgress): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loader.load(source, resolve, onProgress, reject)
    })
  }
}

export default class WebGLLoader {
  private readonly manager: LoadingManager
  private readonly loaders: { [index: string]: LoaderDecorator }

  constructor(manager = new LoadingManager()) {
    this.manager = manager
    this.loaders = {}
  }

  async loadFBX(source = "", onProgress?: () => void): Promise<Group> {
    const loader = this.getLoader("FBX")
    return loader.load(source, onProgress)
  }

  async loadGLTF(source = "", onProgress?: () => void): Promise<GLTF> {
    const loader = this.getLoader("GLTF")
    return loader.load(source, onProgress)
  }

  getLoader(type = "GLTF"): LoaderDecorator {
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
