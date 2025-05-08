import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

// In a real app, use a secure environment variable
const JWT_SECRET = "game-prediction-prototype-secret";

// Client-side auth helpers
export function setUserCookie(userData) {
  Cookies.set("user", JSON.stringify(userData), { expires: 1 });
}

export function getUserFromCookie() {
  const userCookie = Cookies.get("user");
  if (!userCookie) {
    return null;
  }
  return JSON.parse(userCookie);
}

export function removeUserCookie() {
  Cookies.remove("user");
}

export function isAdmin() {
  const user = getUserFromCookie();
  return user?.role === "admin";
}

export function isAuthenticated() {
  return !!getUserFromCookie();
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
