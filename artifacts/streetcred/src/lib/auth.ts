export function getAdminToken(): string | null {
  return localStorage.getItem("streetcred_admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("streetcred_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("streetcred_admin_token");
}
