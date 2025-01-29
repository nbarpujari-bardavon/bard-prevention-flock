import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/auth/login.tsx"),
  route("/login/sso", "routes/auth/sso-login.tsx"),
  route("/login/password-reset", "routes/auth/password-reset.tsx"),
  route("/signup", "routes/auth/signup.tsx"),
] satisfies RouteConfig;
