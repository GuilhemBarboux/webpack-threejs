import Machine from "@core/state/machine/Machine"
import { Object3D } from "three"

class Character extends Object3D {
  private readonly machine: Machine

  constructor() {
    super()
  }
}
