import * as fabric from 'fabric';
import React, { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { deleteVersion, getUserAllVersion, getVersion } from "./services/servies";
import { saveBoard } from './services/servies';
import { socket } from '@/socket';
import { toast } from 'sonner';
const Version = ({ open, onOpenChange, roomId, setElements, undoStack, canvasfileref, redoStack, canEdit, setVersionOpen ,attachTextSync}) => {
  const [versionss, setversionss] = useState([])
  const [loading, setloading] = useState(false)

  const getTheData = useCallback(async () => {
    try {
      if (!roomId) return
      setloading(true)
      const data = await getUserAllVersion(roomId)
      setversionss(data)
    } catch (err) {
        
    } finally {
      setloading(false)
    }

  }, [roomId])

const restoreThePage = async (id) => {
  if (!canEdit) return;
  const canvas = canvasfileref.current;
  if (!canvas) return;

  try {
    const { success, elements } = await getVersion(id);
    if (!success || !Array.isArray(elements)) {
      toast.error("Could not load this version");
      return;
    }

    const objects = await fabric.util.enlivenObjects(elements);

  
    canvas.getObjects().forEach((obj) => {
      obj.programmatic = true;
      canvas.remove(obj);
    });

    objects.forEach((obj) => {
      obj.programmatic = true;
      canvas.add(obj);
      if (obj instanceof fabric.IText) attachTextSync?.(obj);
    });
    canvas.requestRenderAll();

    undoStack.current = [...objects];
    redoStack.current = [];

    socket.emit("clear-canvas", []);
    objects.forEach((obj) => socket.emit("canvas-data", obj.toObject(["id"])));

    await saveBoard(canvas, roomId);

    setElements(elements);
    setVersionOpen(false);
    toast.success("Version restored");
  } catch (err) {
    console.error("restore failed:", err);
    toast.error(err.message || "Restore failed");
  }
};

  const deleteTheRecord = async (_id) => {
    try {

      const data = await deleteVersion(_id)
      if (data) {
        setversionss((prev) => prev.filter((u) => u._id !== _id))
        toast.success('Deleted Successfully')
      }
    } catch (err) {
      console.log(err.message)
    }
  }


  useEffect(() => {
    if (!open || !roomId) return;

    getTheData();
  }, [open, roomId, getTheData]);


  return (

    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-purple-200 p-1 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className={'text-2xl'} >Version History</SheetTitle>
          <SheetDescription>
            View or restore previous board versions.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3 overflow-y-auto">
          {versionss.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No versions available.
            </p>
          ) : (
            versionss.map((version, index) => (
              <div
                key={version._id}
                className="rounded-lg bg-purple-100 border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium">
                      Version {index + 1}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {version.message || "Nothing Mentioned"}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex cursor-pointer shrink-0 items-center gap-2">

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault(),
                          restoreThePage(version._id)
                      }}
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" />
                      Restore
                    </Button>


                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive cursor-pointer hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteTheRecord(version._id)
                      }}
                      aria-label={`Delete version ${index + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Version;
