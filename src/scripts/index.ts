import ready from "domready"
import AsyncPreloader from "async-preloader"
import manifest from "@src/data/manifest.json"

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
    pProgress.map((p: Promise<any>) => {
      p.then(() => {
        loadedCount++
        progress = loadedCount / pProgress.length
        // console.log(progress);
      })
      return p
    })
  )
    .then(([{ default: App }]) => {
      window.app = new App()
      return window.app.start()
    })
    .then(() => {
      console.log("Loaded", progress)
    })
    .catch((e) => {
      console.log("preload", e)
    })
}

ready(preload)
