(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/apps_web_a358b7f2._.js", {

"[project]/apps/web/instrumentation.ts [instrumentation-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Polyfill localStorage for Node.js to fix Next.js dev overlay error
// Node 20+ has experimental localStorage that's broken when --localstorage-file isn't set properly
__turbopack_context__.s({
    "register": (()=>register)
});
async function register() {
    if ("TURBOPACK compile-time truthy", 1) {
        // Server-side: polyfill localStorage if it exists but is broken
        const g = globalThis;
        if (g.localStorage && typeof g.localStorage.getItem !== "function") {
            // Create a simple in-memory storage polyfill
            const storage = new Map();
            g.localStorage = {
                getItem: (key)=>storage.get(key) ?? null,
                setItem: (key, value)=>storage.set(key, value),
                removeItem: (key)=>storage.delete(key),
                clear: ()=>storage.clear(),
                key: (index)=>[
                        ...storage.keys()
                    ][index] ?? null,
                get length () {
                    return storage.size;
                }
            };
        }
    }
}
}}),
"[project]/apps/web/edge-wrapper.js { MODULE => \"[project]/apps/web/instrumentation.ts [instrumentation-edge] (ecmascript)\" } [instrumentation-edge] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i("[project]/apps/web/instrumentation.ts [instrumentation-edge] (ecmascript)"));
modProm.catch(()=>{});
self._ENTRIES["middleware_instrumentation"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}}),
}]);

//# sourceMappingURL=apps_web_a358b7f2._.js.map