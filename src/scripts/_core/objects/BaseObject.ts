import { Mesh, Object3D } from "three"
import { IRenderObject } from "@core/render"
import { IPhysicObject } from "@core/physics"

abstract class BaseObject
  extends Object3D
  implements IRenderObject, IPhysicObject {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateRender(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updatePhysic(): void {}
}

export default BaseObject
