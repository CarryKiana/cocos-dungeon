import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import { CONTROL_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager'
import { BurstStateMachine } from './BurstStateMachine';
import DataManager from '../../Runtime/DataManager';
import { IEntity } from '../../Levels';
import { EnemyManager } from '../../Base/EnemyManager';
import { EntityManager } from '../../Base/EntityManager';
const { ccclass, property } = _decorator

@ccclass('BurstManager')
export class BurstManager extends EntityManager {

  async init (params:IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()
    super.init(params)
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
  }

  onDestroy () {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
  }

  onBurst () {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.player
    if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
      this.state = ENTITY_STATE_ENUM.ATTACK
    } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      this.state = ENTITY_STATE_ENUM.DEATH
      if (this.x === playerX && this.y === playerY) {
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
      }
    }
  }
}
