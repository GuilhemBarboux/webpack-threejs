import { LoadingManager, Scene } from "three"
import { IRenderObject } from "@core/render"
import WebGLLoader from "@core/render/three/ThreeLoader"
import AsyncPreloader from "async-preloader"

abstract class BaseScene extends Scene implements IRenderObject {
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

  abstract updateRender(): void
}

export default BaseScene
