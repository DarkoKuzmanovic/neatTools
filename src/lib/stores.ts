import { writable } from "svelte/store";

// Initialize from localStorage if available, otherwise empty
const storedApiKey = typeof localStorage !== "undefined" ? localStorage.getItem("googleApiKey") : null;
export const googleApiKey = writable<string>(storedApiKey || "");

// Subscribe to changes and update localStorage
if (typeof localStorage !== "undefined") {
  googleApiKey.subscribe((value) => {
    localStorage.setItem("googleApiKey", value);
  });
}
