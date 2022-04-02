import { _decorator, Component, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import State from './State';
import { CONTROL_ENUM, EVENT_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import EventManager from '../Runtime/EventManager';
import { StateMachine } from './StateMachine';
const { ccclass, property } = _decorator


@ccclass('SubStateMachine')
export abstract class SubStateMachine {
  private _currentState: State = null
  stateMachines: Map<string, State> = new Map()

  constructor(public fsm:StateMachine) {}

  get currentState() {
    return this._currentState
  }

  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }

  abstract run():void
}
