import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAppContext } from "@/context/AppContext";

export function AuthForms() {
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
  const { state } = useAppContext();
  
  // Switch between login and register forms
  useEffect(() => {
    const handleSwitchForm = (e: Event) => {
      const customEvent = e as CustomEvent<'login' | 'register'>;
      setActiveForm(customEvent.detail);
    };
    
    window.addEventListener('switch-auth-form', handleSwitchForm as EventListener);
    
    return () => {
      window.removeEventListener('switch-auth-form', handleSwitchForm as EventListener);
    };
  }, []);
  
  // If user is already authenticated, show a message
  if (state.isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Already Logged In</h2>
          <p className="text-muted-foreground mb-6">
            You are already logged in as {state.user?.name}.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center w-full">
      {activeForm === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}