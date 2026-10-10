/** Endpoint awal backend Nuxt/Nitro; tidak membocorkan secret. */
export default defineEventHandler(() => {
  const config = useRuntimeConfig();

  return {
    status: "ok",
    service: "sipenta-nuxt-api",
    databaseConfigured: Boolean(config.public.supabaseUrl),
    aiServiceConfigured: Boolean(config.aiServiceUrl && config.aiServiceKey),
    timestamp: new Date().toISOString(),
  };
});
