import { useState } from "react";
import { useGithubToken } from "../hooks/use-github-token";

export function TokenConfig() {
  const { token, updateToken } = useGithubToken();
  const [inputValue, setInputValue] = useState(token);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    updateToken(inputValue.trim());
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    updateToken("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:border-border-hover transition-colors"
      >
        <span className="relative flex h-2 w-2">
          {!token && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              token ? "bg-green-500" : "bg-amber-500"
            }`}
          />
        </span>
        {token ? "Token active" : "No token"}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-xl border border-border bg-surface p-4 shadow-xl">
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-colors focus:border-neutral-500"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-neutral-200 px-3 py-1.5 text-xs font-medium text-background hover:bg-white transition-colors"
            >
              Save
            </button>
            {token && (
              <button
                onClick={handleClear}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:border-border-hover transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
