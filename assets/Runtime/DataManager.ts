import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
export default class DataManager extends Singleton {
  mapInfo: Array<Array<ITile>>
  mapRowCount: number = 0
  mapColumnRount: number = 0
  levelIndex:number = 1
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnRount = 0
  }
}
