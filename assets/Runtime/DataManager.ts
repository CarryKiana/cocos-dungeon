import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { TileManager } from '../Scripts/Tile/TileManager'
export default class DataManager extends Singleton {
  mapInfo: Array<Array<ITile>>
  tileInfo: Array<Array<TileManager>>
  mapRowCount: number = 0
  mapColumnRount: number = 0
  levelIndex:number = 1
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.mapRowCount = 0
    this.mapColumnRount = 0
  }
}
