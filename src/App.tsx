import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppProvider } from './context/AppContext';
import { QueryProvider } from './providers/QueryProvider';
import { Layout } from './components/Layout';
import { UserForm } from './components/UserForm';
import { UsersTable } from './components/UsersTable';
import { AuthForms } from './components/AuthForms';
import { useAppContext } from './context/AppContext';
import { Toaster } from "@/components/ui/sonner";

// Wrapper component to use context
function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { state } = useAppContext();

  // Listen for tab switching events (used by auth components)
  useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActiveTab(customEvent.detail);
    };
    
    document.addEventListener('switch-tab', handleSwitchTab as EventListener);
    
    return () => {
      document.removeEventListener('switch-tab', handleSwitchTab as EventListener);
    };
  }, []);

  return (
    <Layout>
      <div className="grid gap-6">
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="form">Add User</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="py-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="text-xl font-medium">Total Users</div>
                <div className="mt-2 text-3xl font-bold">5</div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="text-xl font-medium">Admins</div>
                <div className="mt-2 text-3xl font-bold">1</div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="text-xl font-medium">Editors</div>
                <div className="mt-2 text-3xl font-bold">2</div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="text-xl font-medium">Regular Users</div>
                <div className="mt-2 text-3xl font-bold">2</div>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Welcome to React Application Boilerplate</h2>
              <p className="text-muted-foreground mb-4">
                This boilerplate includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>React for UI development</li>
                <li>TailwindCSS for styling</li>
                <li>shadcn UI for component library</li>
                <li>React Hook Form with Zod for form validation</li>
                <li>React Context/Reducer for state management</li>
                <li>TanStack Query for data fetching</li>
                <li>TanStack Table for data tables</li>
                <li>Authentication flow with login and registration</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="users" className="py-4">
            {state.isAuthenticated ? (
              <UsersTable />
            ) : (
              <div className="rounded-lg border bg-card p-6 shadow-sm text-center">
                <h2 className="text-xl font-medium mb-2">Authentication Required</h2>
                <p className="text-muted-foreground">Please log in to view users.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="form" className="py-4">
            {state.isAuthenticated ? (
              <div className="max-w-md mx-auto">
                <UserForm />
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-6 shadow-sm text-center">
                <h2 className="text-xl font-medium mb-2">Authentication Required</h2>
                <p className="text-muted-foreground">Please log in to add users.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="auth" className="py-4">
            <div className="max-w-md mx-auto">
              <AuthForms />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </Layout>
  );
}

function App() {
  return (
    <QueryProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </QueryProvider>
  );
}

export default App;