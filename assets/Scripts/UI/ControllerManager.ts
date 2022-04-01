import { _decorator, Component, Node } from 'cc';
import { CONTROL_ENUM, EVENT_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
const { ccclass, property } = _decorator

@ccclass('ControllerManager')
export class ControllerManager extends Component {

  handleCtrl(evt:Event, type: string) {
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, type as CONTROL_ENUM)
  }
}
