// 1、需要知道animationClip

import { animation, AnimationClip, Sprite, SpriteFrame, UITransform } from "cc";
import ResourceManager from "../Runtime/ResourceManager";
import { sortSpriteFrame } from "../Utils";
import { StateMachine } from "./StateMachine";


export const ANIMATION_SPEED = 1/8

// 2、需要播放动画的能力animation
export default class State {
  private animationClip: AnimationClip

  constructor(
    private fsm:StateMachine,
    private path: string,
    private wrapMode : AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private speed: number = ANIMATION_SPEED,
    private events: any[] = []
    ) {
    this.init()
  }

  async init () {
        const promise = ResourceManager.Instance.loadDir(this.path)
        this.fsm.waitingList.push(promise)
        const spriteFrames = await promise

        this.animationClip = new AnimationClip()

        const track = new animation.ObjectTrack() // 创建一个向量轨道
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
        const frames:Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item,index)=>[this.speed * index, item])
        track.channel.curve.assignSorted(frames)

        // 将轨道添加到动画剪辑以应用
        this.animationClip.addTrack(track)
        this.animationClip.name = this.path
        this.animationClip.duration = frames.length * this.speed
        this.animationClip.wrapMode = this.wrapMode

        for (const event of this.events) {
          this.animationClip.events.push(event)
        }
        // this.animationClip.updateEventDatas()
        this.animationClip.events = this.animationClip.events
  }

  run() {
    if (this.fsm.animationComponent?.defaultClip?.name === this.animationClip.name) {
      return
    }

    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
