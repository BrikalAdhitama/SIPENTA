// Pembungkus tipis untuk toast global (components/GlobalToast.vue memasang window.$toast).
type ToastType = "success" | "error" | "info";

export function useAppToast() {
  function notify(type: ToastType, title: string, message = "") {
    (window as unknown as { $toast?: (p: { type: ToastType; title: string; message: string }) => void }).$toast?.({
      type,
      title,
      message,
    });
  }
  return {
    sukses: (title: string, message = "") => notify("success", title, message),
    galat: (title: string, message = "") => notify("error", title, message),
    info: (title: string, message = "") => notify("info", title, message),
  };
}
