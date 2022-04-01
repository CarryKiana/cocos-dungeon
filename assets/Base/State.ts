// 1、需要知道animationClip

import { AnimationClip } from "cc";
import { PlayerStateMachine } from "../Scripts/Player/PlayerStateMachine";

// 2、需要播放动画的能力animation
export default class State {
  constructor(private fsm:PlayerStateMachine, private path: string, private wrapMode : AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {

  }
}
