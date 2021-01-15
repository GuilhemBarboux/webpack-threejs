import BaseScene from "@core/objects/BaseScene"
import { Scene } from "three"
import { World } from "cannon-es"

// ---------------------------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------------------------
export type sceneType = BaseScene<Scene, World>

export const sceneList: { [index: string]: string } = {
  intro: "Intro",
}

export const defaultScene = Object.keys(sceneList)[0]
