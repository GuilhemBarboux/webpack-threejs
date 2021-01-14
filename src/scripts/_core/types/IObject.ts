export default interface IObject {
  load(): Promise<void>
  updateRender(): void
  updatePhysic(): void
}
