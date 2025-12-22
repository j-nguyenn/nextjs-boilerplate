import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Info,
  X,
  ArrowRight
} from 'lucide-react';
import { ConfigureDatasetDialog, InstructionsDialog } from '@/components/evaluation';
import { useAppContext } from '@/context/AppContext';
import type {
  EvaluationData,
  EvaluationQuestion,
  EvaluationResponse,
  DatasetFieldConfig
} from '@/types/evaluation';



const defaultQuestions: EvaluationQuestion[] = [
  {
    id: 'overall_quality',
    type: 'rating',
    label: 'Overall Quality',
    required: true,
    options: [1, 2, 3, 4, 5],
    minLabel: 'Poor',
    maxLabel: 'Excellent'
  },
  {
    id: 'content_accurate',
    type: 'yes_no',
    label: 'Is the content accurate and appropriate?',
    required: true,
    options: ['Yes', 'No']
  }
];

const defaultFieldConfig: DatasetFieldConfig[] = [
  { field: 'name', label: 'Name', included: true },
  { field: 'latest_yoy_pct', label: 'Latest YoY %', included: true },
  { field: 'reasons_for_change', label: 'Reasons for Change', included: true },
  { field: 'supporting_text', label: 'Supporting Text', included: true },
  { field: 'reference', label: 'Reference', included: true }
];

export function EvaluationPreview() {
  const { state, dispatch } = useAppContext();

  // Load data from context or use sample data
  const evaluationData = state.evaluation?.data || [];
  const evaluationName = state.evaluation?.name || 'Evaluation';
  const evaluationMode = state.evaluation?.mode || 'create';
  const templateId = state.evaluation?.templateId;

  // Determine if user can edit questions (create/edit mode) or only answer (answer mode)
  const canEditQuestions = evaluationMode === 'create' || evaluationMode === 'edit';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<EvaluationQuestion[]>(
    state.evaluation?.questions?.length ? state.evaluation.questions : defaultQuestions
  );
  const [responses, setResponses] = useState<Record<string, EvaluationResponse[]>>(
    state.evaluation?.responses || {}
  );
  const [additionalComments, setAdditionalComments] = useState('');
  const [isConfigureDatasetOpen, setIsConfigureDatasetOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [fieldConfig, setFieldConfig] = useState<DatasetFieldConfig[]>(
    state.evaluation?.fieldConfig?.length ? state.evaluation.fieldConfig : defaultFieldConfig
  );
  const [instructions, setInstructions] = useState(state.evaluation?.instructions || '');

  const currentItem = evaluationData[currentIndex];
  const totalItems = evaluationData.length;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleResponseChange = (questionId: string, value: string | number | boolean) => {
    const itemKey = currentIndex.toString();
    const existingResponses = responses[itemKey] || [];
    const existingIndex = existingResponses.findIndex(r => r.questionId === questionId);

    const newResponse: EvaluationResponse = { questionId, value };

    if (existingIndex >= 0) {
      existingResponses[existingIndex] = newResponse;
    } else {
      existingResponses.push(newResponse);
    }

    setResponses({
      ...responses,
      [itemKey]: existingResponses
    });
  };

  const getResponseValue = (questionId: string) => {
    const itemKey = currentIndex.toString();
    const itemResponses = responses[itemKey] || [];
    const response = itemResponses.find(r => r.questionId === questionId);
    return response?.value;
  };

  const handleAddQuestion = () => {
    const newQuestion: EvaluationQuestion = {
      id: `custom_${Date.now()}`,
      type: 'text',
      label: 'New Question',
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleQuestionLabelChange = (questionId: string, newLabel: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, label: newLabel } : q
    ));
  };

  const handleCancel = () => {
    // Clear evaluation from context and navigate back
    dispatch({ type: 'CLEAR_EVALUATION' });
    dispatch({ type: 'NAVIGATE', payload: '/' });
  };

  const handleSave = () => {
    // Save as template (for data scientists)
    // Saves the evaluation structure without requiring responses
    const templatePayload = {
      id: templateId || `template_${Date.now()}`,
      name: evaluationName,
      data: evaluationData,
      sampleData: evaluationData, // Store sample data for users to answer questions
      questions,
      fieldConfig,
      instructions,
      createdAt: new Date().toISOString(),
      status: 'draft' as const,
    };

    if (evaluationMode === 'edit' && templateId) {
      // Update existing template
      dispatch({ type: 'UPDATE_TEMPLATE', payload: templatePayload });
    } else {
      // Create new template
      dispatch({ type: 'SAVE_TEMPLATE', payload: templatePayload });
    }
    dispatch({ type: 'NAVIGATE', payload: '/' });
  };

  const handleSubmit = () => {
    // Submit responses (for end users)
    // Saves the actual answers to questions
    dispatch({
      type: 'SUBMIT_EVALUATION',
      payload: {
        id: `eval_${Date.now()}`,
        name: evaluationName,
        data: evaluationData,
        questions,
        responses,
        fieldConfig,
        instructions,
        submittedAt: new Date().toISOString(),
        status: 'completed',
      },
    });
    dispatch({ type: 'NAVIGATE', payload: '/' });
  };

  const renderQuestion = (question: EvaluationQuestion) => {
    const value = getResponseValue(question.id);

    switch (question.type) {
      case 'rating':
        return (
          <Card key={question.id} className="mb-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <Label className="text-base font-medium">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{question.minLabel}</span>
                <span>{question.maxLabel}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(question.options as number[])?.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={value === option ? "default" : "outline"}
                    className="px-3 py-1.5 text-sm font-medium rounded-md border"
                    onClick={() => handleResponseChange(question.id, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'yes_no':
        return (
          <Card key={question.id} className="mb-4">
            <CardContent className="pt-6">
              <Label className="text-base font-medium mb-3 block">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="flex gap-2">
                {(question.options as string[])?.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={value === option ? "default" : "outline"}
                    className="px-6 h-10"
                    onClick={() => handleResponseChange(question.id, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'text':
      case 'custom':
        return (
          <Card key={question.id} className="mb-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                {canEditQuestions ? (
                  <Input
                    value={question.label}
                    onChange={(e) => handleQuestionLabelChange(question.id, e.target.value)}
                    className="text-base font-medium border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                  />
                ) : (
                  <Label className="text-base font-medium">
                    {question.label}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                )}
                {canEditQuestions && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Textarea
                value={value?.toString() || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder="Enter your response..."
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{evaluationName}</h1>
              <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded">
                {evaluationMode === 'answer' ? 'Answering' : evaluationMode === 'edit' ? 'Editing' : 'Draft'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {canEditQuestions && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsConfigureDatasetOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Dataset
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsInstructionsOpen(true)}
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Instructions
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              {canEditQuestions ? (
                <Button onClick={handleSave}>
                  {evaluationMode === 'edit' ? 'Update' : 'Save'}
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Data Display */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Query</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{currentItem.name}</p>
                {fieldConfig.find(f => f.field === 'latest_yoy_pct')?.included && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Latest YoY: {currentItem.latest_yoy_pct}%
                  </p>
                )}
              </CardContent>
            </Card>

            {fieldConfig.find(f => f.field === 'reasons_for_change')?.included && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reasons for Change</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentItem.reasons_for_change.map((reason, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <p className="font-medium">{reason.reason}</p>
                      {fieldConfig.find(f => f.field === 'supporting_text')?.included &&
                        reason.supporting_text && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {reason.supporting_text}
                          </p>
                        )}
                      {fieldConfig.find(f => f.field === 'reference')?.included && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Source: {reason.reference.file_name}, Page {reason.reference.page_number}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Evaluation Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Evaluation</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {totalItems}
                </span>
                <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex === totalItems - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Questions */}
            {questions.map(renderQuestion)}

            {/* Additional Comments */}
            <Card>
              <CardContent className="pt-6">
                <Label className="text-base font-medium mb-3 block">
                  Additional Comments
                </Label>
                <Textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  placeholder="Enter additional comments..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Add Question Button - only show for template creators/editors */}
            {canEditQuestions && (
              <Button
                variant="outline"
                className="w-full border-dashed h-16"
                onClick={handleAddQuestion}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add a Question
              </Button>
            )}

            {/* Action Buttons - different based on mode */}
            {canEditQuestions ? (
              // Template creation/edit mode - show Save Template button
              <Button className="w-full" size="lg" onClick={handleSave}>
                {evaluationMode === 'edit' ? 'Update Template' : 'Save Template'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              // Answer mode - show Submit button
              <Button className="w-full" size="lg" onClick={handleSubmit}>
                Submit Evaluation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ConfigureDatasetDialog
        open={isConfigureDatasetOpen}
        onOpenChange={setIsConfigureDatasetOpen}
        fieldConfig={fieldConfig}
        onFieldConfigChange={setFieldConfig}
      />

      <InstructionsDialog
        open={isInstructionsOpen}
        onOpenChange={setIsInstructionsOpen}
        instructions={instructions}
        onInstructionsChange={setInstructions}
      />
    </div>
  );
}
