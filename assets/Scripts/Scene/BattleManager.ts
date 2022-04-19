
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager'
import { createUINode } from '../../Utils'
import Levels, { ILevel } from '../../Levels'
import DataManager  from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel
    stage: Node

    onLoad () {
      EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    }

    onDestroy() {
      EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    }

    start () {
      this.generateStage()
      this.initLevel()
    }

    initLevel () {
      const level = Levels[`level${DataManager.Instance.levelIndex}`]
      if (level) {
        this.clearLevel()

        this.level = level

        DataManager.Instance.mapInfo = this.level.mapInfo
        DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
        DataManager.Instance.mapColumnRount = this.level.mapInfo[0].length || 0

        this.generateTileMap()
        this.generateBurst()
        this.generateDoor()
        this.generateEnemies()
        this.generatePlayer()
      }
    }

    nextLevel() {
      DataManager.Instance.levelIndex++
      this.initLevel()
    }

    clearLevel() {
      this.stage.destroyAllChildren()
      DataManager.Instance.reset()
    }

    generateStage () {
      this.stage = createUINode()
      this.stage.setParent(this.node)
    }

    async generateTileMap () {
      const tileMap = createUINode()
      tileMap.setParent(this.stage)
      const tileMapManager = tileMap.addComponent(TileMapManager)
      await tileMapManager.init()

      this.adaptPos()
    }
    async generateBurst () {
      const burst = createUINode()
      burst.setParent(this.stage)
      const burstManager = burst.addComponent(BurstManager)
      await burstManager.init({
        x: 2,
        y: 6,
        type:ENTITY_TYPE_ENUM.BURST,
        direction: DIRECTION_ENUM.TOP,
        state: ENTITY_STATE_ENUM.IDLE
      })
      DataManager.Instance.bursts.push(burstManager)
    }

    async generatePlayer () {
      const player = createUINode()
      player.setParent(this.stage)
      const playerManager = player.addComponent(PlayerManager)
      await playerManager.init({
        x: 2,
        y: 8,
        type:ENTITY_TYPE_ENUM.PLAYER,
        direction: DIRECTION_ENUM.TOP,
        state: ENTITY_STATE_ENUM.IDLE
      })
      DataManager.Instance.player = playerManager
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN)
    }

    async generateEnemies() {
      const enemy = createUINode()
      enemy.setParent(this.stage)
      const woodenSkeletonManager = enemy.addComponent(WoodenSkeletonManager)
      await woodenSkeletonManager.init({
        x: 2,
        y: 2,
        type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
        direction: DIRECTION_ENUM.TOP,
        state: ENTITY_STATE_ENUM.IDLE
      })
      DataManager.Instance.enemies.push(woodenSkeletonManager)

      const enemy2 = createUINode()
      enemy2.setParent(this.stage)
      const ironSkeletonManager = enemy2.addComponent(IronSkeletonManager)
      await ironSkeletonManager.init({
        x: 2,
        y: 4,
        type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
        direction: DIRECTION_ENUM.TOP,
        state: ENTITY_STATE_ENUM.IDLE
      })
      DataManager.Instance.enemies.push(ironSkeletonManager)
    }

    async generateDoor () {
      const door = createUINode()
      door.setParent(this.stage)
      const doorManager = door.addComponent(DoorManager)
      await doorManager.init({
        x: 7,
        y: 8,
        type:ENTITY_TYPE_ENUM.DOOR,
        direction: DIRECTION_ENUM.TOP,
        state: ENTITY_STATE_ENUM.IDLE
      })
      DataManager.Instance.door = doorManager
    }

    adaptPos () {
      const { mapRowCount, mapColumnRount } = DataManager.Instance

      const disX = TILE_WIDTH * mapRowCount / 2
      const disY = TILE_HEIGHT * mapColumnRount / 2 + 80

      this.stage.setPosition(-disX, disY)
    }
}

