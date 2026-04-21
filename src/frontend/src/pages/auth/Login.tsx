import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export function Login() {
  const login = useAuthStore((state) => state.login);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <TaskaLogo className="h-12" />
      <h1 className="text-2xl font-bold">Mundo Público (Login)</h1>
      <Button onClick={login}>Entrar no Sistema (Simular Auth)</Button>
    </div>
  );
}
