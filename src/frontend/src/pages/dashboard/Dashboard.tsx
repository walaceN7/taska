import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCompany = () => {
      const user = useAuthStore.getState().user;
      if (!user?.companyId && user?.systemRole === "CompanyAdmin") {
        navigate("/onboarding", { replace: true });
      }
    };
    checkCompany();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-secondary/30">
      <h1 className="text-3xl font-bold">Mundo Privado (Dashboard)</h1>
      <p>Você só está vendo isso porque está autenticado!</p>
      <Button
        variant="destructive"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Sair (Logout)
      </Button>
    </div>
  );
}
