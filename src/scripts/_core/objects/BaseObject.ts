import IObject from "@core/types/IObject"

export default class BaseObject<MeshType, BodyType> implements IObject {
  public readonly isStatic: boolean = true
  public readonly body: BodyType
  public readonly mesh: MeshType

  constructor(mesh: MeshType, body?: BodyType) {
    this.mesh = mesh
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
