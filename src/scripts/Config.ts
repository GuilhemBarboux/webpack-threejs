// ---------------------------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------------------------
const sceneList: { [index: string]: string } = {
  scene1: "@scenes/scene1",
}

const defaultScene = Object.keys(sceneList)[0]

// ---------------------------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------------------------
export default {
  defaultScene,
  sceneList,
}

export { sceneList, defaultScene }
