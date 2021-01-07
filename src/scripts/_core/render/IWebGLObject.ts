interface IWebGLObject {
  update(): void
  load(): Promise<void>
}

export { IWebGLObject }
