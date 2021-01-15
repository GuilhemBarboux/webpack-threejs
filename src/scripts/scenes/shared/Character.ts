import Machine from "@core/state/machine/Machine"
import BaseObject from "@core/objects/BaseObject"
import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from "three"
import { Body } from "cannon-es"

export default class Character extends BaseObject<Mesh, Body> {
  public readonly machine: Machine

  constructor() {
    const mesh = new Mesh(
      new BoxBufferGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 0xffff00 })
    )
    const body = new Body()

    super(mesh, body)

    this.machine = new Machine()
  }
}
