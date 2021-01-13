import { HemisphereLight } from "three"

import BaseObject from "@core/types/BaseObject"
import ThreeLoader from "@core/utils/ThreeLoader"

class Scene1 implements BaseObject {
  async load(): Promise<void> {
    await this.addLights()
    await this.addObjects()
  }

  // ---------------------------------------------------------------------------------------------
  // OBJECTS
  // ---------------------------------------------------------------------------------------------
  async addLights() {
    const hemiLight = new HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 200, 0)
    this.add(hemiLight)
  }

  async addObjects() {
    const boombox = await ThreeLoader.loadGLTF("boombox")
    this.add(boombox.scene)
  }

  updatePhysic(): void {}

  updateRender(): void {}
}

export default Scene1
