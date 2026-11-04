import { onRequest as __api_xai_realtime_ts_onRequest } from "D:\\reverion-project\\reveriontech\\functions\\api\\xai-realtime.ts"

export const routes = [
    {
      routePath: "/api/xai-realtime",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_xai_realtime_ts_onRequest],
    },
  ]