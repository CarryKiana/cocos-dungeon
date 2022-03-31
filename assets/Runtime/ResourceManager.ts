import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { resources, SpriteFrame } from 'cc';
export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }
  // "texture/tile/tile"
  loadDir (path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, type, function (err, assets) {
        if (err) {
          reject(err)
          return
        }

        resolve(assets as SpriteFrame[])
      })
    })
  }
}
