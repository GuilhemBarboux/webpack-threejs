import { Mesh } from "three"
import { IWebGLObject } from "../../render/IWebGLObject"

class BaseMesh extends Mesh implements IWebGLObject {
  update: () => void
  load: () => Promise<any>
}

export default BaseMesh
