import BaseScene from "@core/objects/BaseScene"
import { HemisphereLight } from "three"

class Scene1 extends BaseScene {
  async load() {
    await this.addLights()
    await this.addObjects()
  }
  update() {}

  // ---------------------------------------------------------------------------------------------
  // OBJECTS
  // ---------------------------------------------------------------------------------------------

  async addLights() {
    const hemiLight = new HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 200, 0)
    this.add(hemiLight)
  }

  async addObjects() {
    const loader = BaseScene.getLoader()
    const boombox = await loader.loadGLTF("boombox")
    this.add(boombox.scene)
  }
}

export default Scene1
