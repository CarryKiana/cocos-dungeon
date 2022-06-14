import { _decorator, Component, game } from "cc";
import { EVENT_ENUM } from "../../Enum";
import EventManager from "../../Runtime/EventManager";

const { ccclass, property }  = _decorator

@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking = false
  private oldTime: number = 0
  private oldPos: { x: number, y: number } = { x: 0, y: 0 }

  onLoad () {
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy () {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)
  }

  stop () {
    this.isShaking = false
  }

  onShake () {
    if (this.isShaking) {
      return
    }
    this.oldTime = game.totalTime
    this.isShaking = true
    this.oldPos.x = this.node.position.x
    this.oldPos.y = this.node.position.y
  }

  update () {
    if (this.isShaking) {
      const duration = 1000
      const amount = 1.6
      const frequency = 12
      // y = A * Sin*(w * x + f) // A是振幅，越大值域越大，w是频率，越大越密
      const curSecond = (game.totalTime - this.oldTime) / 1000
      const totalSecond = duration / 1000
      const offset = amount * Math.sin(frequency / Math.PI * curSecond)

      this.node.setPosition(this.oldPos.x, this.oldPos.y + offset)

      if (curSecond > totalSecond) {
        this.isShaking = false
        this.node.setPosition(this.oldPos.x, this.oldPos.y)
      }
    }
  }
}
