import { Capacitor } from "@capacitor/core";
import { MOBILE_MAX_WIDTH } from "~/composables/useLayoutMode";

// Jalan sekali sebelum halaman pertama dirender (ssr: false), jadi tidak ada
// kedipan tampilan web → mobile. Di dalam APK selalu mobile.
export default defineNuxtPlugin(() => {
  const isMobile = useState<boolean>("layout:isMobile", () => false);

  if (Capacitor.isNativePlatform()) {
    isMobile.value = true;
    return;
  }

  const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
  isMobile.value = mq.matches;
  mq.addEventListener("change", (e) => {
    isMobile.value = e.matches;
  });
});
