import { _decorator, Component, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { CONTROL_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enum';
import SpikesFourSubStateMachine from './SpikesFourSubStateMachine';

import SpikesOneSubStateMachine from './SpikesOneSubStateMachine';
import SpikesThreeSubStateMachine from './SpikesThreeSubStateMachine';
import SpikesTwoSubStateMachine from './SpikesTwoSubStateMachine';

const { ccclass, property } = _decorator



@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()
    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber())
  }

  initStateMachine () {
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikesTwoSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesThreeSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesFourSubStateMachine(this))
  }

  initAnimationEvent() {
    // this.animationComponent.on(Animation.EventType.FINISHED, () => {
    //   const name = this.animationComponent.defaultClip.name
    //   const whiteList = ['attack', 'turn']
    //   if (whiteList.some(v=> name.includes(v))) {
    //     this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
    //   }
    // })
  }

  run() {
    const { value } = this.params.get(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
    switch (this.currentState) {
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):
        if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO)
        } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE)
        } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)
        } else {
          this.currentState = this.currentState
        }
        break;
      default:
        this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    }
  }
}
