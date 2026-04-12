import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | Portfolio Galo Durante",
  description: "Login to access the Admin area",
} as const;

export default function AuthLoginPage() {
  return <LoginForm />;
}
