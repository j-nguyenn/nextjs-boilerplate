import { ReactNode } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { User, SignOut } from "@phosphor-icons/react";
import { toast } from "sonner";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { state, dispatch } = useAppContext();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success("Logged out successfully");
  };

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent('switch-auth-form', { detail: 'login' }));
    // Update App.tsx tab to the auth tab
    document.dispatchEvent(new CustomEvent('switch-tab', { detail: 'auth' }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">React App Boilerplate</span>
          </div>
          <div className="flex items-center space-x-4">
            {state.isAuthenticated && state.user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User size={20} />
                  <span className="hidden sm:inline">
                    {state.user.name} ({state.user.role})
                  </span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  <SignOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" onClick={handleLogin}>
                <User className="mr-2 h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Display error if present */}
        {state.error && (
          <div className="mb-4 p-4 border border-destructive text-destructive bg-destructive/10 rounded-md">
            {state.error}
          </div>
        )}
        
        {/* Display loading indicator if loading */}
        {state.isLoading && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>React App Boilerplate &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}