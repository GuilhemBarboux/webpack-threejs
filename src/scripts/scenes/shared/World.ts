import { BoxBufferGeometry, MeshBasicMaterial } from "three"
import { Body } from "cannon-es"
import BasePhysicMesh from "@core/objects/BasePhysicMesh"

class World extends BasePhysicMesh {
  constructor() {
    super(
      new BoxBufferGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 0xffff00 }),
      new Body()
    )
  }
}

export default World
