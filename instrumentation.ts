// Polyfill localStorage for Node.js to fix Next.js dev overlay error
// Node 20+ has experimental localStorage that's broken when --localstorage-file isn't set properly

export async function register() {
  if (typeof window === "undefined") {
    // Server-side: polyfill localStorage if it exists but is broken
    const g = globalThis as typeof globalThis & { localStorage?: Storage };

    if (g.localStorage && typeof g.localStorage.getItem !== "function") {
      // Create a simple in-memory storage polyfill
      const storage = new Map<string, string>();

      g.localStorage = {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
        key: (index: number) => [...storage.keys()][index] ?? null,
        get length() {
          return storage.size;
        },
      };
    }
  }
}
