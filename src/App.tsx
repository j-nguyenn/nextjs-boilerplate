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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationPreview } from './pages/new/EvaluationPreview';
import { UploadData } from './pages/new/UploadData';
import { Plus, FileText, Calendar, CheckCircle2, FileEdit, ClipboardList } from 'lucide-react';

// Wrapper component to use context
function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { state, dispatch } = useAppContext();

  // Use currentPath from context for navigation
  const currentPath = state.currentPath;

  const navigate = (path: string) => {
    dispatch({ type: 'NAVIGATE', payload: path });
  };

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

  // Route to upload data page
  if (currentPath === '/new/upload') {
    return <UploadData />;
  }

  // Route to evaluation preview page
  if (currentPath === '/new/preview') {
    return <EvaluationPreview />;
  }

  return (
    <Layout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Evaluations</h1>
          <Button onClick={() => navigate('/new/upload')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileEdit className="w-4 h-4" />
              Templates ({state.evaluationTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Submissions ({state.submittedEvaluations.length})
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-4">
            {state.evaluationTemplates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileEdit className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No templates yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create evaluation templates for your team to use
                  </p>
                  <Button onClick={() => navigate('/new/upload')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {state.evaluationTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {template.description || 'No description'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-sm px-2 py-1 rounded ${template.status === 'published'
                            ? 'text-green-600 bg-green-50'
                            : 'text-amber-600 bg-amber-50'
                            }`}>
                            <FileEdit className="w-3 h-3" />
                            {template.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(template.createdAt).toLocaleDateString()}
                          </span>
                          <span>
                            {template.questions.length} questions
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              dispatch({ type: 'LOAD_TEMPLATE_FOR_EDIT', payload: template });
                            }}
                          >
                            <FileEdit className="w-4 h-4 mr-1" />
                            Edit Questions
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              dispatch({ type: 'LOAD_TEMPLATE_FOR_ANSWER', payload: template });
                            }}
                          >
                            <ClipboardList className="w-4 h-4 mr-1" />
                            Answer Questions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="mt-4">
            {state.submittedEvaluations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground text-center mb-4 max-w-md">
                    {state.evaluationTemplates.length === 0
                      ? 'Create a template first, then you can answer questions from it.'
                      : 'Select a template from the Templates tab and click "Answer Questions" to submit your evaluation.'}
                  </p>
                  {state.evaluationTemplates.length === 0 && (
                    <Button onClick={() => navigate('/new/upload')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Template
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {state.submittedEvaluations.map((evaluation) => (
                  <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{evaluation.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {evaluation.data.length} items evaluated
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            {evaluation.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(evaluation.submittedAt).toLocaleDateString()}
                          </span>
                          <span>
                            {evaluation.questions.length} questions
                          </span>
                          <span>
                            {Object.keys(evaluation.responses).length} responses
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
      <Toaster />
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <QueryProvider>
        <AppContent />
      </QueryProvider>
    </AppProvider>
  );
}

export default App;