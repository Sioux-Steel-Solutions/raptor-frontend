const CHUNK_PUBLIC_PATH = "server/instrumentation.js";
const runtime = require("./chunks/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/apps_web_instrumentation_ts_3103d0a8._.js");
runtime.getOrInstantiateRuntimeModule("[project]/apps/web/instrumentation.ts [instrumentation] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/apps/web/instrumentation.ts [instrumentation] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
