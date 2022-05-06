import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame } from 'cc';

import { SmokeStateMachine } from './SmokeStateMachine';
import { IEntity } from '../../Levels';
import { EntityManager } from '../../Base/EntityManager';
const { ccclass, property } = _decorator

@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  async init (params:IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
