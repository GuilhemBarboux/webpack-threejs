import MachineState from "./MachineState"

class Machine {
  public currentState?: MachineState

  public start(initState: MachineState) {
    this.currentState = initState
  }

  public changeToState(nextState: MachineState) {
    this.currentState?.onExit()
    this.currentState = nextState
    this.currentState?.onEnter()
  }
}

export default Machine
