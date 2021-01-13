import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.d"
import { Group, LoadingManager } from "three"
import { Loader } from "three"

enum LoaderType {
  "GLTF" = "three/examples/jsm/loaders/GLTFLoader",
  "FBX" = "three/examples/jsm/loaders/FBXLoader",
}

export default class ThreeLoader {
  private static manager: LoadingManager = new LoadingManager()
  private static loaders: { [index: string]: Loader } = {}

  public static setManager(m: LoadingManager): void {
    this.manager = m
  }

  public static async loadFBX(
    source = "",
    onProgress?: () => void
  ): Promise<Group> {
    const loader = await this.getLoader(LoaderType.FBX)
    return loader.loadAsync(source, onProgress)
  }

  public static async loadGLTF(
    source = "",
    onProgress?: () => void
  ): Promise<GLTF> {
    const loader = await this.getLoader(LoaderType.GLTF)
    return loader.loadAsync(source, onProgress)
  }

  private static async getLoader(type: LoaderType): Promise<Loader> {
    if (!this.loaders[type]) {
      const loaderImport = await import(type)
      this.loaders[type] = new loaderImport(this.manager)
    }

    return this.loaders[type]
  }
}
