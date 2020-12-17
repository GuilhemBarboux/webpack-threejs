import BaseScene from "@core/objects/BaseScene"
import { HemisphereLight } from "three"

class Scene1 extends BaseScene {
  load() {
    return new Promise(() => {})
  }
  update() {
    super.update()
  }

  // ---------------------------------------------------------------------------------------------
  // OBJECTS
  // ---------------------------------------------------------------------------------------------

  async loadLights() {
    const hemiLight = new HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 200, 0)
    this.add(hemiLight)
  }

  async loadObjects() {
    const loader = BaseScene.getLoader()
    const object1 = await loader.loadGLTF("boombox")
  }
}

export default Scene1
