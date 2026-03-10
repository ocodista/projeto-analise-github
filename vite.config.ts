/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/projeto-analise-github/",
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "node",
    exclude: ["e2e/**", "node_modules/**"],
  },
});
