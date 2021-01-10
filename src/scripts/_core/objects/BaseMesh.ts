import { Mesh } from "three"
import { IRenderObject } from "@core/render"

class BaseMesh extends Mesh implements IRenderObject {
  updateRender: () => void
  load: () => Promise<any>
}

export default BaseMesh
