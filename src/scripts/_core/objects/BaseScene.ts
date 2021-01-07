import { LoadingManager, Scene } from "three"
import { IWebGLObject } from "@core/render/IWebGLObject"
import WebGLLoader from "@core/render/WebGLLoader"
import AsyncPreloader from "async-preloader"

abstract class BaseScene extends Scene implements IWebGLObject {
  static loader: WebGLLoader = null

  static getLoader(): WebGLLoader {
    if (!this.loader) {
      const manager = new LoadingManager()
      manager.setURLModifier((url: string) => {
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
