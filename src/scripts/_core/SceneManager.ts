import { sceneList } from "@src/scripts/Config"
import { Observable, Subject } from "rxjs"
import { sceneType } from "@src/scripts/Config"
import Intro from "@scenes/Intro"

interface SceneItem {
  id: string
  path: string
  import?: any
  instance?: sceneType
}

export default class SceneManager {
  private currentScene: sceneType
  private readonly scenes: Map<string, SceneItem> = new Map<string, SceneItem>()
  private readonly defaultSceneId: string
  private readonly onUpdate: Subject<sceneType> = new Subject<sceneType>()

  get onSceneChange(): Observable<sceneType> {
    return this.onUpdate.asObservable()
  }

  get current(): sceneType {
    return this.currentScene
  }

  set current(s: sceneType) {
    this.currentScene = s
    this.onUpdate.next(s)
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

  async loadScene(id = this.defaultSceneId, reset = false): Promise<sceneType> {
    const loadScene = this.scenes.get(id)

    if (!loadScene) return // TODO: Throw error, scene not config

    if (!loadScene.import) {
      loadScene.import = await import(
        /* webpackMode: "lazy-once" */ `@scenes/${sceneList[id]}`
      )
    }

    if (!loadScene.instance || reset) {
      loadScene.instance = <sceneType>new loadScene.import.default()
    }

    return loadScene.instance
  }
}
