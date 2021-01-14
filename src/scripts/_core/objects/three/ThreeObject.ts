import BaseObject from "@core/objects/BaseObject"
import { Object3D } from "three"

export default class ThreeObject<BodyType> extends BaseObject<
  Object3D,
  BodyType
> {}
