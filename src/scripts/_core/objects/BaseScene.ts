import { LoadingManager, Scene } from "three"
import { IWebGLObject } from "../../render/IWebGLObject"
import WebGLLoader from "../../render/WebGLLoader"
import { AsyncPreloader } from "async-preloader"

abstract class BaseScene extends Scene implements IWebGLObject {
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

  abstract load(): Promise<any>

  abstract update(): void
}

export default BaseScene
