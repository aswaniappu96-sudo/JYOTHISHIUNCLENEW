const LOGIN_PROMPT_KEY = "ju_login_prompt";

export function loginPromptSeen() {
  try {
    return sessionStorage.getItem(LOGIN_PROMPT_KEY) === "1";
  } catch {
    return true;
  }
}

export function markLoginPromptSeen() {
  try {
    sessionStorage.setItem(LOGIN_PROMPT_KEY, "1");
  } catch {
    /* ignore */
  }
}
