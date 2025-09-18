declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API: string;
      NEXT_PUBLIC_LEAFLET_ACCESS_TOKEN: string;
    }
  }
}

export {};
