import { EntityManager } from '../Base/EntityManager'
import Singleton from '../Base/Singleton'
import { ILevel, ITile } from '../Levels'
import { BurstManager } from '../Scripts/Burst/BurstManager'
import { DoorManager } from '../Scripts/Door/DoorManager'
import { PlayerManager } from '../Scripts/Player/PlayerManager'
import { SmokeManager } from '../Scripts/Smoke/SmokeManager'
import { SpikesManager } from '../Scripts/Spikes/SpikesManager'
import { TileManager } from '../Scripts/Tile/TileManager'

export type IRecord = Omit<ILevel, 'mapInfo'>

export default class DataManager extends Singleton {
  mapInfo: Array<Array<ITile>>
  tileInfo: Array<Array<TileManager>>
  mapRowCount: number = 0
  mapColumnRount: number = 0
  levelIndex:number = 1
  player: PlayerManager
  door: DoorManager
  enemies: EntityManager[]
  bursts: BurstManager[]
  spikes: SpikesManager[]
  smokes: SmokeManager[]
  records: IRecord[]
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.enemies = []
    this.bursts = []
    this.spikes = []
    this.smokes = []
    this.records = []
    this.mapRowCount = 0
    this.mapColumnRount = 0
    this.player = null
    this.door = null
  }
}
