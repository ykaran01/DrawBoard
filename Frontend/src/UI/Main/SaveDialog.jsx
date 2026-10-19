import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const MAX_LEN = 200;

const SaveVersionDialog = ({ open, onOpenChange, onSubmit, saving }) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (open) setMessage("");
  }, [open]);

  const trimmed = message.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trimmed || saving) return;
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Save Version</DialogTitle>
            <DialogDescription>
              Add a short message so you can recognise this version later.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_LEN))}
              onKeyDown={(e) => {
      
                if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
              }}
              rows={3}
              placeholder="e.g. Added toolbar and improved layout"
              className="w-full resize-none rounded-md border border-slate-300 bg-white p-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
           
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!trimmed || saving}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              <Save className="mr-1 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveVersionDialog;