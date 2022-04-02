import { _decorator, Component, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { CONTROL_ENUM, EVENT_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
const { ccclass, property } = _decorator



@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()
    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())

    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger())

    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
  }

  initStateMachine () {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, 'texture/player/idle/top',  AnimationClip.WrapMode.Loop))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new State(this, 'texture/player/turnleft/top'))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn']
      if (whiteList.some(v=> name.includes(v))) {
        this.setParams(PARAMS_NAME_ENUM.IDLE, true)
      }
    })
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
        break;
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
