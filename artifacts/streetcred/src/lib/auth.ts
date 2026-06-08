export function getAdminToken(): string | null {
  return localStorage.getItem("streetcred_admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("streetcred_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("streetcred_admin_token");
}

export function getUserToken(): string | null {
  return localStorage.getItem("streetcred_user_token");
}

export function setUserToken(token: string) {
  localStorage.setItem("streetcred_user_token", token);
}

export function clearUserToken() {
  localStorage.removeItem("streetcred_user_token");
}

export interface DecodedUser {
  id: number;
  email: string;
  username: string;
  role: string;
  country: string;
}

export function decodeUserToken(token: string): DecodedUser | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    if (!decoded.id || !decoded.email) return null;
    return {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username || decoded.email.split("@")[0],
      role: decoded.role || "user",
      country: decoded.country || "MW",
    };
  } catch {
    return null;
  }
}

export function getCurrentUser(): DecodedUser | null {
  const token = getUserToken();
  if (!token) return null;
  return decodeUserToken(token);
}
