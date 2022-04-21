import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import { CONTROL_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from 'db://assets/Enum';
import EventManager from 'db://assets/Runtime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager';
import ResourceManager from 'db://assets/Runtime/ResourceManager'
import { ISpikes } from 'db://assets/Levels';
import { StateMachine } from 'db://assets/Base/StateMachine';
import { SpikesStateMachine } from './SpikesStateMachine'
import { randomByLen } from 'db://assets/Utils';
import DataManager from '../../Runtime/DataManager';
const { ccclass, property } = _decorator

@ccclass('SpikesManager')
export class SpikesManager extends Component {
  id:string = randomByLen(12)
  x:number = 0
  y:number = 0
  fsm:StateMachine

  private _count: number
  private _totalCount: number
  private type:ENTITY_TYPE_ENUM

  get count () {
    return this._count
  }

  set count (newCount:number) {
    this._count = newCount
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, newCount)
  }

  get totalCount () {
    return this._totalCount
  }

  set totalCount (newTotalCount:number) {
    this._totalCount = newTotalCount
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, newTotalCount)
  }


  async init (params:ISpikes) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = sprite.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(SpikesStateMachine)
    await this.fsm.init()
    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[params.type]
    this.count = params.count

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
  }
  onLoop () {
    if (this.count === this.totalCount) {
      this.count = 1
    } else {
      this.count++
    }
    this.onAttack()
  }
  backZero () {
    this.count = 0
  }

  onAttack () {
    if (!DataManager.Instance.player) {
      return
    }
    const { x: playerX, y:PlayerY } = DataManager.Instance.player
    if (this.x === playerX && this.y === PlayerY && this.count === this.totalCount) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    }
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
  onDestroy () {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop)
  }
}
