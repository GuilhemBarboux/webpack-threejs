import Machine from "./Machine"

abstract class MachineState {
  public name: string

  private readonly owner: Machine

  protected constructor(name: string, machine: Machine) {
    this.name = name
    this.owner = machine
  }

  // Decorator
  public changeToState(nextState: MachineState) {
    this.owner.changeToState(nextState)
  }

  // Routine
  abstract onEnter(): void
  abstract onUpdate(): void
  abstract onExit(): void
}

export default MachineState
