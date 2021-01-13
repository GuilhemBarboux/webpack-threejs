import { LoadingManager, Scene } from "three"
import { IRenderObject } from "@core/render"
import AsyncPreloader from "async-preloader"

abstract class BaseScene extends Scene implements IRenderObject {
  abstract load(): Promise<any>

  abstract updateRender(): void
}

export default BaseScene
