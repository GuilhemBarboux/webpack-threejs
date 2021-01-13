import { LoadingManager, Scene } from "three"
import { IRenderObject } from "@core/render"
import AsyncPreloader from "async-preloader"

abstract class BaseScene extends Scene implements
  {
  abstract load(): Promise<vo>

  abstract updateRender(): void
}

export default BaseScene
