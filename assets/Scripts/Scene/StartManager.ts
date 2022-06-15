import { _decorator, Component, Node, director } from 'cc';
import { CONTROL_ENUM, EVENT_ENUM, SCENE_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
import FaderManager from '../../Runtime/FaderManager';
const { ccclass, property } = _decorator

@ccclass('StartManager')
export class StartManager extends Component {

  onLoad () {
    FaderManager.Instance.fadeOut(1000)
    this.node.once(Node.EventType.TOUCH_END, this.handleStart, this)
  }

  async handleStart () {
    await FaderManager.Instance.fadeIn(300)
    director.loadScene(SCENE_ENUM.Battle)
  }
}
