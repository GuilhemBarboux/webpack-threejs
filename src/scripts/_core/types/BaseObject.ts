export default interface BaseObject {
  load(): Promise<void>
  updateRender(): void
  updatePhysic(): void
}
