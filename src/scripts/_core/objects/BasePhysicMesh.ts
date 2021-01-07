import { IPhysicObject } from "@core/physics/IPhysicObject"
import { Body } from "cannon-es"
import { BufferGeometry, Geometry, Material } from "three"

import BaseMesh from "./BaseMesh"

class BasePhysicMesh extends BaseMesh implements IPhysicObject {
  body: Body

  constructor(
    geometry: Geometry | BufferGeometry,
    material: Material,
    body: Body
  ) {
    super(geometry, material)
    this.body = body
  }
}

export default BasePhysicMesh
