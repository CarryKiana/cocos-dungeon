import { _decorator, Component, Node, director, resources, ProgressBar } from 'cc';
import { CONTROL_ENUM, EVENT_ENUM, SCENE_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
import FaderManager from '../../Runtime/FaderManager';
const { ccclass, property } = _decorator

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar = null

  onLoad () {
    resources.preloadDir("texture", (cur, total) => {
      this.bar.progress = cur / total
    }, () => {
      director.loadScene(SCENE_ENUM.Start)
    })
  }
}
