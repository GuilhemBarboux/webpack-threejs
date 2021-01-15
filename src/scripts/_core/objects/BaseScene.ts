import IObject from "@core/types/IObject"
import IScene from "@core/types/IScene"
import BaseObject from "@core/objects/BaseObject"

export default class BaseScene<SceneType, WorldType>
  extends BaseObject<SceneType, WorldType>
  implements IScene {
  public children: IObject[] = []

  public updatePhysic(): void {
    this.children.forEach((c) => c.updatePhysic())
  }

  public updateRender(): void {
    this.children.forEach((c) => c.updateRender())
  }
}
