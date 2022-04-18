// 1、需要知道animationClip

import { animation, AnimationClip, Sprite, SpriteFrame, UITransform } from "cc";
import ResourceManager from "../Runtime/ResourceManager";
import { sortSpriteFrame } from "../Utils";
import { StateMachine } from "./StateMachine";


const ANIMATION_SPEED = 1/8

// 2、需要播放动画的能力animation
export default class State {
  private animationClip: AnimationClip

  constructor(private fsm:StateMachine, private path: string, private wrapMode : AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {
    this.init()
  }

  async init () {
        const promise = ResourceManager.Instance.loadDir(this.path)
        this.fsm.waitingList.push(promise)
        const spriteFrames = await promise

        this.animationClip = new AnimationClip()

        const track = new animation.ObjectTrack()
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
        const frames:Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item,index)=>[ANIMATION_SPEED * index, item])
        track.channel.curve.assignSorted(frames)

        this.animationClip.addTrack(track)
        this.animationClip.name = this.path
        this.animationClip.duration = frames.length * ANIMATION_SPEED
        this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
