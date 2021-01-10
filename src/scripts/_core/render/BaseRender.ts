export default abstract class BaseRender {
  abstract draw(): void
  abstract update(): void
  abstract resize(vw: number, vh: number): void
}
