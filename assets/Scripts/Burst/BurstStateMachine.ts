import { _decorator, Component, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { CONTROL_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';

const BASE_URL = 'texture/burst'

const { ccclass, property } = _decorator



@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()
    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
  }

  initStateMachine () {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, `${BASE_URL}/idle`))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,  new State(this, `${BASE_URL}/death`))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK,  new State(this, `${BASE_URL}/attack`))
  }

  initAnimationEvent() {
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else {
          this.currentState = this.currentState
        }
        break;
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
