import { _decorator, Component, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import State from './State';
import { CONTROL_ENUM, EVENT_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import EventManager from '../Runtime/EventManager';
const { ccclass, property } = _decorator

type ParamsValueType = boolean | number

export interface IParamsValue {
  type: FSM_PARAM_TYPE_ENUM,
  value: ParamsValueType
}

export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAM_TYPE_ENUM.TRIGGER,
    value: false
  }
}

export const getInitParamsNumber = () => {
  return {
    type: FSM_PARAM_TYPE_ENUM.NUMBER,
    value: 0
  }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  private _currentState: State = null
  params:Map<string, IParamsValue> = new Map()
  stateMachines: Map<string, State> = new Map()
  animationComponent: Animation
  waitingList: Array<Promise<SpriteFrame[]>> = []

  getParams(paramsName:string) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }

  setParams(paramsName:string, value:ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      this.run()
      this.resetTrigger()
    }
  }

  get currentState() {
    return this._currentState
  }

  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }

  resetTrigger() {
    for(const [_, value] of this.params) {
      if (value.type === FSM_PARAM_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    }
  }

  abstract init():void
  abstract run():void
}
