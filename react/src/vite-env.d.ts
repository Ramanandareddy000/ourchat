/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_JWT_SECRET: string
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}