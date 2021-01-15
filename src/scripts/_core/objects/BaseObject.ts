import IObject from "@core/types/IObject"

export default class BaseObject<Object3DType, BodyType> implements IObject {
  public readonly isStatic: boolean = true
  public readonly object3D: Object3DType
  public readonly body: BodyType

  constructor(object3D: Object3DType, body?: BodyType) {
    this.object3D = object3D
    this.body = body
    this.isStatic = !this.body
  }

  public async load(): Promise<void> {
    // Add async model loading
  }

  public updatePhysic(): void {
    // Update Mesh physic (move ...)
  }

  public updateRender(): void {
    // Update Mesh rendering (move ...)
  }
}
