import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { DatasetFieldConfig } from '@/types/evaluation';

interface ConfigureDatasetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldConfig: DatasetFieldConfig[];
  onFieldConfigChange: (config: DatasetFieldConfig[]) => void;
}

export function ConfigureDatasetDialog({
  open,
  onOpenChange,
  fieldConfig,
  onFieldConfigChange,
}: ConfigureDatasetDialogProps) {
  const handleToggleField = (field: string) => {
    const updatedConfig = fieldConfig.map(f =>
      f.field === field ? { ...f, included: !f.included } : f
    );
    onFieldConfigChange(updatedConfig);
  };

  const handleSelectAll = () => {
    const allIncluded = fieldConfig.every(f => f.included);
    const updatedConfig = fieldConfig.map(f => ({ ...f, included: !allIncluded }));
    onFieldConfigChange(updatedConfig);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Dataset</DialogTitle>
          <DialogDescription>
            Select which fields to include or exclude from the evaluation display.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <Label className="text-sm font-medium">Fields</Label>
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              {fieldConfig.every(f => f.included) ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          {fieldConfig.map((field) => (
            <div key={field.field} className="flex items-center space-x-3">
              <Checkbox
                id={field.field}
                checked={field.included}
                onCheckedChange={() => handleToggleField(field.field)}
              />
              <Label
                htmlFor={field.field}
                className="text-sm font-normal cursor-pointer"
              >
                {field.label}
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
