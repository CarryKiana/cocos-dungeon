import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
export default class DataManager extends Singleton {
  mapInfo: Array<Array<ITile>>
  mapRowCount: number
  mapColumnRount: number
  static get Instance() {
    return super.GetInstance<DataManager>()
  }
}
