import { _decorator, Component, Node } from 'cc';
import { CONTROL_ENUM, EVENT_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
const { ccclass, property } = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {

  handleUndo() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }

  handleRestart() {
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }

  handleOut() {
    EventManager.Instance.emit(EVENT_ENUM.QUIT_BATTLE)
  }
}
