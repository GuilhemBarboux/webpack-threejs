import { IPhysicObject } from "../../physics/IPhysicObject"
import { Body } from "cannon-es"
import BaseMesh from "./BaseMesh"
import { BufferGeometry, Geometry, Material } from "three"

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
