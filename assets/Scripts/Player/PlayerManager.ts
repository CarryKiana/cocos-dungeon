import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame } from 'cc';
import { CONTROL_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager'
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from 'db://assets/Base/EntityManager'
import DataManager from '../../Runtime/DataManager';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {

  targetX:number = 0
  targetY:number = 0
  IsMoving = false
  private readonly speed = 1/10

  async init (params:IEntity) {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    super.init(params)
    this.targetX = this.x
    this.targetY = this.y

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
  }

  update() {
    this.updateXY()
    super.update()
  }

  updateXY () {
    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {
      this.x += this.speed
    }

    if (this.targetY < this.y) {
      this.y -= this.speed
    } else if (this.targetY > this.y) {
      this.y += this.speed
    }

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1 && this.IsMoving) {
      this.IsMoving = false
      this.x = this.targetX
      this.y = this.targetY
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }
  onDead (type: ENTITY_STATE_ENUM) {
    this.state = type
  }

  inputHandle (inputDirection: CONTROL_ENUM) {
    if (this.IsMoving) {
      return
    }

    if (this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATH || this.state === ENTITY_STATE_ENUM.ATTACK) {
      return
    }

    const id = this.willAttack(inputDirection)
    if (id) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
      EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
      return
    }

    if (this.willBlock(inputDirection)) {
      console.log('block')
      return
    }
    this.move(inputDirection)
  }

  move(inputDirection: CONTROL_ENUM) {
    // console.log(DataManager.Instance.tileInfo)
    if (inputDirection === CONTROL_ENUM.TOP) {
      this.targetY -= 1
      this.IsMoving = true
    } else if (inputDirection === CONTROL_ENUM.BOTTOM) {
      this.targetY += 1
      this.IsMoving = true
    } else if (inputDirection === CONTROL_ENUM.LEFT) {
      this.targetX -= 1
      this.IsMoving = true
    } else if (inputDirection === CONTROL_ENUM.RIGHT) {
      this.targetX += 1
      this.IsMoving = true
    } else if (inputDirection === CONTROL_ENUM.TURNLEFT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }

      this.state = ENTITY_STATE_ENUM.TURNLEFT
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    } else if (inputDirection === CONTROL_ENUM.TURNRIGHT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.TOP
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      }
      this.state = ENTITY_STATE_ENUM.TURNRIGHT
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  willAttack (inputDirection: CONTROL_ENUM) {
    const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH )
    for (let i = 0; i < enemies.length; i++) {
      const { x: enemyX, y: enemyY, id: enemyId } = enemies[i]
      if (inputDirection === CONTROL_ENUM.TOP &&
        this.direction === DIRECTION_ENUM.TOP &&
        enemyX === this.x &&
        enemyY === this.targetY - 2
        ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      } else if (inputDirection === CONTROL_ENUM.LEFT &&
        this.direction === DIRECTION_ENUM.LEFT &&
        enemyY === this.y &&
        enemyX === this.targetX - 2
        ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      } else if (inputDirection === CONTROL_ENUM.BOTTOM &&
        this.direction === DIRECTION_ENUM.BOTTOM &&
        enemyX === this.x &&
        enemyY === this.targetY + 2
        ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      } else if (inputDirection === CONTROL_ENUM.RIGHT &&
        this.direction === DIRECTION_ENUM.RIGHT &&
        enemyY === this.y &&
        enemyX === this.targetX - 2
        ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      }
    }
    return ''
  }

  willBlock(inputDirection: CONTROL_ENUM) {
    const { targetX: x, targetY: y, direction } = this
    const { tileInfo, mapRowCount, mapColumnRount } = DataManager.Instance
    const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door
    const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
    const bursts = DataManager.Instance.bursts.filter(burst => burst.state !== ENTITY_STATE_ENUM.DEATH)

    let playerTile, weaponTile, playerNextY,playerNextX, weaponNextY, weaponNextX
    if (inputDirection === CONTROL_ENUM.TOP) {
      if (direction === DIRECTION_ENUM.TOP) {
        playerNextY = y - 1
        weaponNextY = y - 2
        playerNextX = x
        weaponNextX = x
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        playerNextY = y - 1
        weaponNextY = y
        playerNextX = x
        weaponNextX = x
      } else if (direction === DIRECTION_ENUM.LEFT) {
        playerNextY = y - 1
        weaponNextY = y - 1
        playerNextX = x
        weaponNextX = x - 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        playerNextY = y - 1
        weaponNextY = y - 1
        playerNextX = x
        weaponNextX = x + 1
      }
      if (((playerNextX === doorX && playerNextY === doorY) || (weaponNextX === doorX && weaponNextY === doorY)) && doorState !== ENTITY_STATE_ENUM.DEATH) {
        this.state = ENTITY_STATE_ENUM.BLOCKFRONT
        return true
      }
      for (let i = 0; i < enemies.length; i++) {
        const { x: enemyX, y: enemyY } = enemies[i]
        if (((playerNextX === enemyX && playerNextY === enemyY) || (weaponNextX === enemyX && weaponNextY === enemyY))) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }
      }

      for (let i = 0; i < bursts.length; i++) {
        const { x: burstX, y: burstY } = bursts[i]
        if ((playerNextX === burstX && playerNextY === burstY) && (!weaponTile || weaponTile.turnable)) {
          return false
        }
      }

      if (playerNextY < 0 || (playerNextY > mapColumnRount - 1) || (playerNextX < 0) || (playerNextX > mapRowCount - 1)) {
        this.state = ENTITY_STATE_ENUM.BLOCKFRONT
        return true
      }
      playerTile = tileInfo[playerNextX][playerNextY]
      weaponTile = tileInfo[weaponNextX][weaponNextY]
      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKFRONT
        return true
      }
    } else if (inputDirection === CONTROL_ENUM.BOTTOM) {
      if (direction === DIRECTION_ENUM.TOP) {
        playerNextY = y + 1
        weaponNextY = y
        playerNextX = x
        weaponNextX = x
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        playerNextY = y + 1
        weaponNextY = y + 2
        playerNextX = x
        weaponNextX = x
      } else if (direction === DIRECTION_ENUM.LEFT) {
        playerNextY = y + 1
        weaponNextY = y + 1
        playerNextX = x
        weaponNextX = x - 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        playerNextY = y + 1
        weaponNextY = y + 1
        playerNextX = x
        weaponNextX = x + 1
      }

      if (((playerNextX === doorX && playerNextY === doorY) || (weaponNextX === doorX && weaponNextY === doorY)) && doorState !== ENTITY_STATE_ENUM.DEATH) {
        this.state = ENTITY_STATE_ENUM.BLOCKBACK
        return true
      }

      for (let i = 0; i < enemies.length; i++) {
        const { x: enemyX, y: enemyY } = enemies[i]
        if (((playerNextX === enemyX && playerNextY === enemyY) || (weaponNextX === enemyX && weaponNextY === enemyY))) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK
          return true
        }
      }

      for (let i = 0; i < bursts.length; i++) {
        const { x: burstX, y: burstY } = bursts[i]
        if ((playerNextX === burstX && playerNextY === burstY) && (!weaponTile || weaponTile.turnable)) {
          return false
        }
      }

      if (playerNextY < 0 || (playerNextY > mapColumnRount - 1) || (playerNextX < 0) || (playerNextX > mapRowCount - 1)) {
        this.state = ENTITY_STATE_ENUM.BLOCKBACK
        return true
      }
      playerTile = tileInfo[playerNextX][playerNextY]
      weaponTile = tileInfo[weaponNextX][weaponNextY]
      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKBACK
        return true
      }
    } else if (inputDirection === CONTROL_ENUM.LEFT) {
      if (direction === DIRECTION_ENUM.TOP) {
        playerNextY = y
        weaponNextY = y - 1
        playerNextX = x - 1
        weaponNextX = x - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        playerNextY = y
        weaponNextY = y + 1
        playerNextX = x - 1
        weaponNextX = x - 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        playerNextY = y
        weaponNextY = y
        playerNextX = x - 1
        weaponNextX = x - 2
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        playerNextY = y
        weaponNextY = y
        playerNextX = x - 1
        weaponNextX = x
      }

      if (((playerNextX === doorX && playerNextY === doorY) || (weaponNextX === doorX && weaponNextY === doorY)) && doorState !== ENTITY_STATE_ENUM.DEATH) {
        this.state = ENTITY_STATE_ENUM.BLOCKLEFT
        return true
      }

      for (let i = 0; i < enemies.length; i++) {
        const { x: enemyX, y: enemyY } = enemies[i]
        if (((playerNextX === enemyX && playerNextY === enemyY) || (weaponNextX === enemyX && weaponNextY === enemyY))) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT
          return true
        }
      }

      for (let i = 0; i < bursts.length; i++) {
        const { x: burstX, y: burstY } = bursts[i]
        if ((playerNextX === burstX && playerNextY === burstY) && (!weaponTile || weaponTile.turnable)) {
          return false
        }
      }

      if (playerNextY < 0 || (playerNextY > mapColumnRount - 1) || (playerNextX < 0) || (playerNextX > mapRowCount - 1)) {
        this.state = ENTITY_STATE_ENUM.BLOCKLEFT
        return true
      }
      playerTile = tileInfo[playerNextX][playerNextY]
      weaponTile = tileInfo[weaponNextX][weaponNextY]
      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKLEFT
        return true
      }
    } else if (inputDirection === CONTROL_ENUM.RIGHT) {
      if (direction === DIRECTION_ENUM.TOP) {
        playerNextY = y
        weaponNextY = y - 1
        playerNextX = x + 1
        weaponNextX = x + 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        playerNextY = y
        weaponNextY = y + 1
        playerNextX = x + 1
        weaponNextX = x + 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        playerNextY = y
        weaponNextY = y
        playerNextX = x + 1
        weaponNextX = x
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        playerNextY = y
        weaponNextY = y
        playerNextX = x + 1
        weaponNextX = x + 2
      }

      if (((playerNextX === doorX && playerNextY === doorY) || (weaponNextX === doorX && weaponNextY === doorY)) && doorState !== ENTITY_STATE_ENUM.DEATH) {
        this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
        return true
      }

      for (let i = 0; i < enemies.length; i++) {
        const { x: enemyX, y: enemyY } = enemies[i]
        if (((playerNextX === enemyX && playerNextY === enemyY) || (weaponNextX === enemyX && weaponNextY === enemyY))) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
          return true
        }
      }
      for (let i = 0; i < bursts.length; i++) {
        const { x: burstX, y: burstY } = bursts[i]
        if ((playerNextX === burstX && playerNextY === burstY) && (!weaponTile || weaponTile.turnable)) {
          return false
        }
      }

      if (playerNextY < 0 || (playerNextY > mapColumnRount - 1) || (playerNextX < 0) || (playerNextX > mapRowCount - 1)) {
        this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
        return true
      }
      playerTile = tileInfo[playerNextX][playerNextY]
      weaponTile = tileInfo[weaponNextX][weaponNextY]
      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
        return true
      }
    } else if (inputDirection === CONTROL_ENUM.TURNLEFT) {
      let nextX
      let nextY
      if (direction == DIRECTION_ENUM.TOP) {
        nextX= x - 1
        nextY = y - 1
      } else if (direction == DIRECTION_ENUM.BOTTOM) {
        nextX= x + 1
        nextY = y + 1
      } else if (direction == DIRECTION_ENUM.LEFT) {
        nextX= x - 1
        nextY = y + 1
      } else if (direction == DIRECTION_ENUM.RIGHT) {
        nextX= x + 1
        nextY = y - 1
      }

      if (((x === doorX && nextY === doorY) || (nextX === doorX && y === doorY) || (nextX === doorX && nextY === doorY)) && doorState !== ENTITY_STATE_ENUM.DEATH) {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
        return true
      }

      for (let i = 0; i < enemies.length; i++) {
        const { x: enemyX, y: enemyY } = enemies[i]
        if ((x === enemyX && nextY === enemyY) || (nextX === enemyX && y === enemyY) || (nextX === enemyX && nextY === enemyY)) {
          this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
          return true
        }
      }

      for (let i = 0; i < bursts.length; i++) {
        const { x: burstX, y: burstY } = enemies[i]
        if ((playerNextX === burstX && playerNextY === burstY) && (!weaponTile || weaponTile.turnable)) {
          return false
        }
      }

      if ((!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
      (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) &&
      ((!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable))) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
        return true
      }
    } else if (inputDirection === CONTROL_ENUM.TURNRIGHT) {
      let nextX
      let nextY
      if (direction == DIRECTION_ENUM.TOP) {
        nextX = x + 1
        nextY = y - 1
      } else if (direction == DIRECTION_ENUM.BOTTOM) {
        nextX = x - 1
        nextY = y + 1
      } else if (direction == DIRECTION_ENUM.LEFT) {
        nextX = x - 1
        nextY = y - 1
      } else if (direction == DIRECTION_ENUM.RIGHT) {
        nextX = x + 1
        nextY = y + 1
      }

      if (((x === doorX && nextY === doorY) || (nextX === doorX && y === doorY) || (nextX === doorX && nextY === doorY)) && doorState !== ENTITY_STATE_ENUM.DEATH) {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT
        return true
      }

      for (let i = 0; i < enemies.length; i++) {
        const { x: enemyX, y: enemyY } = enemies[i]
        if ((x === enemyX && nextY === enemyY) || (nextX === enemyX && y === enemyY) || (nextX === enemyX && nextY === enemyY)) {
          this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT
          return true
        }
      }

      if ((!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
      (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) &&
      ((!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable))) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT
        return true
      }
    }
    return false
  }
}
