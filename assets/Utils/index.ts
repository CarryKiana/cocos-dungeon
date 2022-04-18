import { Layers, Node, SpriteFrame, UITransform } from 'cc';
export const createUINode = (name:string = '') => {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0, 1)
  node.layer = 1 << Layers.nameToLayer("UI_2D")
  return node
}

export const randomByRange = (start:number, end:number) => Math.floor(start + (end - start) * Math.random())

const reg = /\((\d+)\)/

const getNumberWithString = (str: string) => parseInt(str.match(reg)[1] || '0')

export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) =>
  spriteFrames.sort((a, b) => getNumberWithString(a.name) - getNumberWithString(b.name))
