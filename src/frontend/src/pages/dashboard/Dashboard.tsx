import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export function Dashboard() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-secondary/30">
      <h1 className="text-3xl font-bold">Mundo Privado (Dashboard)</h1>
      <p>Você só está vendo isso porque está autenticado!</p>
      <Button variant="destructive" onClick={logout}>
        Sair (Logout)
      </Button>
    </div>
  );
}
