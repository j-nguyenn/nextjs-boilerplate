import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileJson, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import type { EvaluationData } from '@/types/evaluation';

interface UploadDataProps {
  onDataUploaded?: (data: EvaluationData[]) => void;
}

export function UploadData({ onDataUploaded }: UploadDataProps) {
  const { dispatch } = useAppContext();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<EvaluationData[] | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [evaluationName, setEvaluationName] = useState('');

  const parseJsonData = (text: string): EvaluationData[] | null => {
    try {
      const parsed = JSON.parse(text);
      // Handle both array and single object
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];

      // Validate structure
      for (const item of dataArray) {
        if (!item.name || item.reasons_for_change === undefined) {
          throw new Error('Invalid data structure. Each item must have "name" and "reasons_for_change" fields.');
        }
      }

      return dataArray;
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your data.');
      } else if (err instanceof Error) {
        setError(err.message);
      }
      return null;
    }
  };

  const handleFileUpload = useCallback((file: File) => {
    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file.');
      return;
    }

    setUploadedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonText(text);
      const data = parseJsonData(text);
      if (data) {
        setJsonData(data);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonText(text);
    setError(null);

    if (text.trim()) {
      const data = parseJsonData(text);
      if (data) {
        setJsonData(data);
        setUploadedFile(null);
      } else {
        setJsonData(null);
      }
    } else {
      setJsonData(null);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setJsonData(null);
    setJsonText('');
    setError(null);
  };

  const handleContinue = () => {
    if (jsonData && onDataUploaded) {
      onDataUploaded(jsonData);
    } else if (jsonData) {
      // Store data in app context and navigate to preview
      dispatch({
        type: 'SET_EVALUATION_DATA',
        payload: {
          name: evaluationName || 'Untitled Evaluation',
          data: jsonData,
        },
      });
      dispatch({ type: 'NAVIGATE', payload: '/new/preview' });
    }
  };

  const handleCancel = () => {
    dispatch({ type: 'NAVIGATE', payload: '/' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Create New Evaluation</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!jsonData}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Evaluation Name */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Name</CardTitle>
              <CardDescription>
                Give your evaluation a descriptive name
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Q4 Financial Report Analysis"
                value={evaluationName}
                onChange={(e) => setEvaluationName(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Data</CardTitle>
              <CardDescription>
                Upload a JSON file or paste your data directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag & Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                  ${uploadedFile ? 'bg-muted/50' : 'hover:border-primary/50'}
                `}
              >
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileJson className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearFile}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-1">
                      Drag and drop your JSON file here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>

              {/* Or Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or paste JSON</span>
                </div>
              </div>

              {/* JSON Textarea */}
              <div>
                <Label htmlFor="json-input" className="sr-only">
                  JSON Data
                </Label>
                <Textarea
                  id="json-input"
                  placeholder={`Paste your JSON data here...

Example:
{
  "name": "Net Profit",
  "latest_yoy_pct": 3,
  "reasons_for_change": [
    {
      "reason": "Sales increased",
      "supporting_text": "...",
      "reference": {
        "file_name": "Report.pdf",
        "page_number": 24
      }
    }
  ]
}`}
                  value={jsonText}
                  onChange={handleTextareaChange}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {jsonData && !error && (
                <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Valid JSON detected: {jsonData.length} item{jsonData.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Preview */}
          {jsonData && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  Review the data that will be used for evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {jsonData.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-md bg-muted/50 border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.latest_yoy_pct !== undefined && (
                            <p className="text-sm text-muted-foreground">
                              YoY: {item.latest_yoy_pct}%
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {item.reasons_for_change?.length || 0} reasons
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
