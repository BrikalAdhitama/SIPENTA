// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const isValidUrl = (v?: string) => {
  try { return !!v && !v.includes("<") && !!new URL(v); } catch { return false; }
};
const envUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY;
const supabaseUrl = isValidUrl(envUrl) ? envUrl! : "http://localhost:54321";
const supabaseKey = envKey && !envKey.includes("<") ? envKey : "dummy-anon-key-for-local-ui";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",

  // SPA — satu build untuk web hosting & Capacitor (tidak butuh server Node)
  ssr: false,

  modules: ["@pinia/nuxt", "@nuxtjs/supabase"],

  // Tailwind CSS v4 lewat plugin resmi Vite (sama seperti prototype figmake).
  // Tidak ada tailwind.config.js — konfigurasi ada di assets/css/tailwind.css (@theme).
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  supabase: {
    // Fallback dummy supaya `npm run dev` tetap jalan walau .env belum diisi
    // (login & data asli tetap butuh kredensial Supabase yang benar).
    url: supabaseUrl,
    key: supabaseKey,
    redirect: false,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  },

  app: {
    head: {
      title: "SIPENTA",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      ],
    },
  },
});
