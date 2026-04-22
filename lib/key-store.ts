const KEY = "openai_key";

type Listener = (key: string | null) => void;
const listeners = new Set<Listener>();

export function getKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setKey(next: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, next);
  listeners.forEach((fn) => fn(next));
}

export function clearKey() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  listeners.forEach((fn) => fn(null));
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === KEY) fn(event.newValue);
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", handleStorage);
  };
}
