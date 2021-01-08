const debugHash = "#debug"
const debug = window.location.hash === debugHash
if (debug) console.log(debugHash)
export default debug
