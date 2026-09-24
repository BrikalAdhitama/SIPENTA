// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",

  // SPA — satu build untuk web hosting & Capacitor (tidak butuh server Node)
  ssr: false,

  modules: ["@pinia/nuxt", /* "@nuxtjs/supabase" */],

  // Tailwind CSS v4 lewat plugin resmi Vite (sama seperti prototype figmake).
  // Tidak ada tailwind.config.js — konfigurasi ada di assets/css/tailwind.css (@theme).
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
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
