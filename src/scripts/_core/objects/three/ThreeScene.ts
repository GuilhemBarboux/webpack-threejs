import { Scene } from "three"
import BaseScene from "@core/objects/BaseScene"
import IObject from "@core/types/IObject"

export default class ThreeScene<WorldType> extends BaseScene<
  Scene,
  WorldType
> {}
