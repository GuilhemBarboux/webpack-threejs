import MachineState from "@core/machine/MachineState"
import Machine from "@core/machine/Machine"

class CharacterState extends MachineState {
  protected character: any

  constructor(name: string, machine: Machine, character: any) {
    super(name, machine)
    this.character = character
  }

  onEnter(): void {}

  onUpdate(): void {}

  onExit(): void {}
}

export default CharacterState
