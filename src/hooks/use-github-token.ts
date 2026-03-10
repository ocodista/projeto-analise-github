import { useSyncExternalStore, useCallback } from "react";
import { getStoredToken, setStoredToken } from "../utils/github-api";

const TOKEN_EVENT = "github-token-change";

function subscribe(callback: () => void): () => void {
  window.addEventListener(TOKEN_EVENT, callback);
  return () => window.removeEventListener(TOKEN_EVENT, callback);
}

function getSnapshot(): string {
  return getStoredToken();
}

export function useGithubToken() {
  const token = useSyncExternalStore(subscribe, getSnapshot);

  const updateToken = useCallback((newToken: string) => {
    setStoredToken(newToken);
    window.dispatchEvent(new Event(TOKEN_EVENT));
  }, []);

  return { token, updateToken } as const;
}
