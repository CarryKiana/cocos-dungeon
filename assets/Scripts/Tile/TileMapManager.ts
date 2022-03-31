
import { _decorator, Component, Node, Sprite, resources, SpriteFrame, UITransform, Layers } from 'cc';
const { ccclass, property } = _decorator;
import { TileManager } from './TileManager';
import { createUINode, randomByRange } from '../../Utils/index'
import DataManager from '../../Runtime/DataManager'
import ResourceManager from '../../Runtime/ResourceManager'

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const spriteFrames = await ResourceManager.Instance.loadDir("texture/tile/tile")
    const { mapInfo }  = DataManager.Instance
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      for (let j = 0; j < column.length; j++) {
        const item = column[j]
        if (item.src === null || item.type === null) {
          continue
        }

        let number = item.src
        if ((number === 1 || number === 5 || number === 9) && i%2 === 0 && j%2 === 0 ) {
          number += randomByRange(0, 4)
        }

        const imgSrc = `tile (${number})`

        const node = createUINode()
        const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0]
        const tilemanager = node.addComponent(TileManager)
        tilemanager.init(spriteFrame, i, j)
        node.setParent(this.node)
      }
    }
  }

  loadRes () {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir("texture/tile/tile", function (err, assets) {
        if (err) {
          reject(err)
          return
        }

        resolve(assets as SpriteFrame[])
      })
    })
  }
}
