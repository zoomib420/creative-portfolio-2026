/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_AI_GUIDE?: string;
  readonly VITE_ENABLE_AUDIO?: string;
  readonly VITE_FORCE_TIER?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
