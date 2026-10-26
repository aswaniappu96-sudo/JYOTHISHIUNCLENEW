const LOGIN_PROMPT_KEY = "ju_login_prompt";
const SERVICES_POPUP_KEY = "ju_services_popup";

export const WELCOME_DELAY_MS = 5000;

function readFlag(key: string) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return true;
  }
}

function writeFlag(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

export function loginPromptSeen() {
  return readFlag(LOGIN_PROMPT_KEY);
}

export function markLoginPromptSeen() {
  writeFlag(LOGIN_PROMPT_KEY);
}

export function servicesPopupSeen() {
  return readFlag(SERVICES_POPUP_KEY);
}

export function markServicesPopupSeen() {
  writeFlag(SERVICES_POPUP_KEY);
}

export function skipWelcomeOnPath(pathname: string) {
  return /^\/(login|register|account)(\/|$)/.test(pathname);
}

const QUEUE_SERVICES_KEY = "ju_queue_services";

export function queueServicesPopup() {
  try {
    sessionStorage.setItem(QUEUE_SERVICES_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function takeQueuedServicesPopup() {
  try {
    if (sessionStorage.getItem(QUEUE_SERVICES_KEY) !== "1") return false;
    sessionStorage.removeItem(QUEUE_SERVICES_KEY);
    return true;
  } catch {
    return false;
  }
}
