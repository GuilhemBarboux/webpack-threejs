import ready from "domready"
import AsyncPreloader from "async-preloader"

// import App from './App';
import { fetchJSON } from "@core/utils/fetch.utils"

declare global {
  interface Window {
    app: any
  }
}

let manifest: any

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

ready(() => {
  // fetch manifest
  fetchJSON("data/manifest.json")
    // assets and main module
    .then((response) => {
      manifest = response
      return preload()
    })
    .catch((e) => {
      console.log("ready", e)
    })
})
