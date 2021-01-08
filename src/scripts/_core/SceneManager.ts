import { defaultScene, sceneList } from "@src/scripts/Config"
import BaseScene from "@core/objects/BaseScene"

interface SceneItem {
  id: string
  path: string
  import?: any
  instance?: BaseScene
}

class SceneManager {
  private currentScene: BaseScene
  private readonly scenes: Map<string, SceneItem> = new Map<string, SceneItem>()
  private readonly defaultSceneId: string

  get current(): BaseScene {
    return this.currentScene
  }

  set current(s: BaseScene) {
    this.currentScene = s
  }

  get list(): Map<string, SceneItem> {
    return this.scenes
  }

  constructor(scenes: { [index: string]: string }) {
    this.defaultSceneId = Object.keys(scenes)[0]

    Object.keys(scenes).forEach((id) =>
      this.scenes.set(id, {
        id,
        path: scenes[id],
      })
    )
  }

  async loadScene(id = this.defaultSceneId, reset = false): Promise<BaseScene> {
    if (!this.scenes[id]) return // TODO: Throw error, scene not config

    if (!this.scenes[id].import) {
      this.scenes[id].import = await import(
        /* webpackMode: "lazy-once" */ `${sceneList[id]}`
      )
    }

    if (!this.scenes[id].instance || reset) {
      delete this.scenes[id]
      this.scenes[id] = <BaseScene>this.scenes[id].import.default()
    }

    return this.scenes[id]
  }
}

export default SceneManager
