import ready from "domready"
import AsyncPreloader from "async-preloader"

// Load data manifest
const manifest = require("@src/data/manifest.json")

declare global {
  interface Window {
    app: any
  }
}

const preload = () => {
  const items = manifest.items

  const pItems = items.map((item: any) => AsyncPreloader.loadItem(item))
  const pApp = import(/* webpackChunkName: 'app' */ "./App")
  const pProgress = [pApp, ...pItems]

  // Progress
  let loadedCount = 0
  let progress = 0

  Promise.all(
    pProgress.map((p) => {
      p.then(() => {
        loadedCount++
        progress = loadedCount / pProgress.length
        // console.log(progress);
      })
      return p
    })
  )
    .then(([{ default: App }, ...items]) => {
      window.app = new App()
      return window.app.load()
    })
    .then(() => {
      console.log("Loaded")
    })
    .catch((e) => {
      console.log("preload", e)
    })
}

ready(preload)
