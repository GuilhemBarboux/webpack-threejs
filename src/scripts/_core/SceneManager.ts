import { sceneList } from "@src/scripts/Config"
import IObject from "@core/types/BaseObject"

interface SceneItem {
  id: string
  path: string
  import?: any
  instance?: IObject
}

class SceneManager {
  private currentScene: IObject
  private readonly scenes: Map<string, SceneItem> = new Map<string, SceneItem>()
  private readonly defaultSceneId: string

  get current(): IObject {
    return this.currentScene
  }

  set current(s: IObject) {
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

  async loadScene(id = this.defaultSceneId, reset = false): Promise<IObject> {
    if (!this.scenes[id]) return // TODO: Throw error, scene not config

    if (!this.scenes[id].import) {
      this.scenes[id].import = await import(
        /* webpackMode: "lazy-once" */ `${sceneList[id]}`
      )
    }

    if (!this.scenes[id].instance || reset) {
      delete this.scenes[id]
      this.scenes[id] = <IObject>this.scenes[id].import.default()
    }

    return this.scenes[id]
  }
}

export default SceneManager
