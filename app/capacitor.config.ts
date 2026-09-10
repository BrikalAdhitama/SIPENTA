import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ac.id.kampus.sipenta",
  appName: "SIPENTA",
  webDir: ".output/public", // hasil `nuxt generate`
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: { launchShowDuration: 1200, backgroundColor: "#0F172A" },
    Keyboard: { resize: "body" },
  },
};

export default config;
