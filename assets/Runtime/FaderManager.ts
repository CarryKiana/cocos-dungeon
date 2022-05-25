import { game, RenderRoot2D } from 'cc'
import { EntityManager } from '../Base/EntityManager'
import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { BurstManager } from '../Scripts/Burst/BurstManager'
import { DoorManager } from '../Scripts/Door/DoorManager'
import { PlayerManager } from '../Scripts/Player/PlayerManager'
import { SmokeManager } from '../Scripts/Smoke/SmokeManager'
import { SpikesManager } from '../Scripts/Spikes/SpikesManager'
import { TileManager } from '../Scripts/Tile/TileManager'
import { DEFAULT_DURATION, DrawManager } from '../Scripts/UI/DrawManager'
import { createUINode } from '../Utils'
export default class FaderManager extends Singleton {
  static get Instance() {
    return super.GetInstance<FaderManager>()
  }

  private _fader:DrawManager = null

  get fader () {
    if (this._fader !== null) {
      return this._fader
    }

    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const fadeNode = createUINode()
    fadeNode.setParent(root)
    this._fader = fadeNode.addComponent(DrawManager)
    this._fader.init()

    game.addPersistRootNode(root)

    return this._fader
  }

  fadeIn (duration:number = DEFAULT_DURATION) {
    return this.fader.fadeIn(duration)
  }

  fadeOut (duration:number = DEFAULT_DURATION) {
    return this.fader.fadeOut(duration)
  }
}
