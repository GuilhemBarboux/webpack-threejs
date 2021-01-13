import Machine from "./Machine"

export default class MachineState {
  public name: string

  private readonly owner: Machine

  protected constructor(name: string, machine: Machine) {
    this.name = name
    this.owner = machine
  }

  // Decorator
  public changeToState(nextState: MachineState): void {
    this.owner.changeToState(nextState)
  }

  // Routine
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onEnter(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onUpdate(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onExit(): void {}
}
