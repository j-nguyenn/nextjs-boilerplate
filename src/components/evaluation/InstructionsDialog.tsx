import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

export function InstructionsDialog({
  open,
  onOpenChange,
  instructions,
  onInstructionsChange,
}: InstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Evaluation Instructions</DialogTitle>
          <DialogDescription>
            Provide instructions for evaluators to follow when completing this evaluation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="instructions" className="text-sm font-medium mb-2 block">
            Instructions
          </Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder="Enter instructions for evaluators...

Example:
- Review each reason for change carefully
- Consider the supporting text when rating accuracy
- Rate overall quality based on clarity and relevance
- Mark content as inaccurate if it contains factual errors"
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Save Instructions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
