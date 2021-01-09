abstract class RenderManager {
  abstract draw(): void
  abstract update(): void
  abstract resize(vw: number, vh: number): void
}

export default RenderManager
