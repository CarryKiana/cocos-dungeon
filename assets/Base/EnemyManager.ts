import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import { CONTROL_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enum';
import EventManager from 'db://assets/Runtime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager';
import { EntityManager } from 'db://assets/Base/EntityManager'
import DataManager from 'db://assets/Runtime/DataManager';
import { IEntity } from '../Levels';
const { ccclass, property } = _decorator

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {

  async init (params:IEntity) {
    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)

    this.onChangeDirection(true)
  }

  onDestroy () {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
  }

  onChangeDirection (isInit: boolean = false) {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.player

    const disX = Math.abs(this.x - playerX)
    const disY = Math.abs(this.y - playerY)

    if (disX === disY && !isInit) {
      return
    }

    if ( playerX >= this.x && playerY  <=  this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP:DIRECTION_ENUM.RIGHT
    } else if ( playerX <= this.x && playerY  <=  this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP:DIRECTION_ENUM.LEFT
    } else if ( playerX <= this.x && playerY  >=  this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM:DIRECTION_ENUM.LEFT
    } else if ( playerX >= this.x && playerY  >=  this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM:DIRECTION_ENUM.RIGHT
    }
  }
  onDead (id) {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    if (this.id === id) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
