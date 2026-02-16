module.exports = {

"[project]/apps/web/instrumentation.ts [instrumentation] (ecmascript)": ((__turbopack_context__) => {
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

};

//# sourceMappingURL=apps_web_instrumentation_ts_3103d0a8._.js.map