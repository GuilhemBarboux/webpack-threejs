import { LoadingManager, Scene } from "three"
import { IWebGLObject } from "../../render/IWebGLObject"
import WebGLLoader from "../../render/WebGLLoader"
import { AsyncPreloader } from "async-preloader"

class BaseScene extends Scene implements IWebGLObject {
  static loader: WebGLLoader = null

  static getLoader() {
    if (!this.loader) {
      const manager = new LoadingManager()
      manager.setURLModifier((url: string) => {
        // @ts-ignore
        return URL.createObjectURL(AsyncPreloader.items.get(url))
      })
      this.loader = new WebGLLoader(manager)
    }

    return this.loader
  }

  objects: { [index: string]: IWebGLObject } = {}

  load(): Promise<any> {
    return undefined
  }
  update() {
    Object.values(this.objects).forEach((o) => o.update())
  }
}

export default BaseScene
