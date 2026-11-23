const LOGIN_PROMPT_KEY = "ju_login_prompt";

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

export function skipWelcomeOnPath(pathname: string) {
  return /^\/(login|register|account|astrologers)(\/|$)/.test(pathname);
}
