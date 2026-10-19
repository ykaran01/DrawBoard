
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  Pencil,
  Eye,
  ChevronDown,
  Crown,
  UserRound,
} from "lucide-react";

const UserList = ({
  open,
  setOpen,
  users = [],
  currentUserId,
  onRoleChange,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = users.find(
    (user) => String(user.id) === String(currentUserId)
  );

  const isAdmin = currentUser?.role === "Admin";

  const handleRoleChange = (user, role) => {
    if (!isAdmin) return;
    if (String(user.id) === String(currentUserId)) return;
    if (user.role === "Admin") return;

    onRoleChange?.(user.id, role);
    setSelectedUser(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-l border-violet-200
                   bg-gradient-to-b from-violet-50 via-white to-white
                   p-0 flex flex-col"
      >
       
        <SheetHeader className="px-6 pt-7 pb-5 border-b border-violet-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-violet-600
                            flex items-center justify-center shadow-lg
                            shadow-violet-200">
              <Users className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1">
              <SheetTitle className="text-xl font-bold text-zinc-900">
                Room members
              </SheetTitle>

              <SheetDescription className="mt-1 text-sm text-zinc-500">
                Manage who's collaborating on this board.
              </SheetDescription>
            </div>

            <span className="rounded-full bg-violet-100 px-3 py-1
                             text-sm font-semibold text-violet-700">
              {users.length}
            </span>
          </div>
        </SheetHeader>

      
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest
                           text-zinc-400">
              People in this room
            </h3>

            {isAdmin && (
              <span className="text-xs font-medium text-violet-600">
                Role management enabled
              </span>
            )}
          </div>

          <div className="space-y-3">
            {users.map((user, index) => {
              const isSelf =
                String(user.id) === String(currentUserId);

              const isUserAdmin = user.role === "Admin";
              const role = user.role || "viewer";
              const isEditing =
                String(selectedUser) === String(user.id);

              return (
                <div
                  key={user.id || user.username || index}
                  className="group rounded-2xl border border-zinc-200
                             bg-white p-4 shadow-sm transition-all
                             hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                   
                    <div className="relative shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || user.username || "Member"}
                          className="h-12 w-12 rounded-full object-cover
                                     ring-2 ring-violet-100"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center
                                        justify-center rounded-full
                                        bg-violet-100 text-violet-700
                                        ring-2 ring-violet-50">
                          <UserRound className="h-6 w-6" />
                        </div>
                      )}

                      <span
                        className="absolute bottom-0 right-0 h-3 w-3
                                   rounded-full border-2 border-white
                                   bg-emerald-500"
                        title="Presence not connected"
                      />
                    </div>

                   
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold
                                      text-zinc-900">
                          {user.name || user.username || "Unknown user"}
                        </p>

                        {isSelf && (
                          <span className="shrink-0 rounded-md
                                           bg-violet-100 px-1.5 py-0.5
                                           text-[10px] font-bold
                                           text-violet-700">
                            YOU
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 truncate text-xs text-zinc-500">
                        @{user.username || "unknown"}
                      </p>
                    </div>

              
                    <div className="shrink-0">
                      {isUserAdmin ? (
                        <span className="inline-flex items-center gap-1
                                         rounded-lg bg-amber-50 px-2.5
                                         py-1.5 text-xs font-semibold
                                         text-amber-700">
                          <Crown className="h-3.5 w-3.5" />
                          Admin
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1
                                      rounded-lg px-2.5 py-1.5
                                      text-xs font-semibold ${
                            role === "editor"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {role === "editor" ? (
                            <Pencil className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                          {role === "editor" ? "Editor" : "Viewer"}
                        </span>
                      )}
                    </div>
                  </div>

                
                  {isAdmin && !isSelf && !isUserAdmin && (
                    <div className="mt-4 border-t border-zinc-100 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUser(isEditing ? null : user.id)
                        }
                        className="flex w-full items-center justify-between
                                   rounded-xl border border-violet-100
                                   bg-violet-50/60 px-3 py-2.5
                                   text-sm font-semibold text-violet-700
                                   transition-colors hover:bg-violet-100"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Manage permissions
                        </span>

                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isEditing ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isEditing && (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            disabled={role === "viewer"}
                            onClick={() =>
                              handleRoleChange(user, "viewer")
                            }
                            className="flex items-center justify-center gap-2
                                       rounded-xl border border-zinc-200
                                       bg-white px-3 py-3 text-sm font-semibold
                                       text-zinc-700 transition-colors
                                       hover:border-zinc-300 hover:bg-zinc-50
                                       disabled:cursor-not-allowed
                                       disabled:opacity-40"
                          >
                            <Eye className="h-4 w-4" />
                            Viewer
                          </button>

                          <button
                            type="button"
                            disabled={role === "editor"}
                            onClick={() =>
                              handleRoleChange(user, "editor")
                            }
                            className="flex items-center justify-center gap-2
                                       rounded-xl border border-violet-200
                                       bg-violet-600 px-3 py-3 text-sm
                                       font-semibold text-white
                                       transition-colors hover:bg-violet-700
                                       disabled:cursor-not-allowed
                                       disabled:opacity-40"
                          >
                            <Pencil className="h-4 w-4" />
                            Editor
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {users.length === 0 && (
              <div className="flex flex-col items-center justify-center
                              rounded-2xl border border-dashed
                              border-violet-200 bg-white px-5 py-12
                              text-center">
                <div className="mb-3 flex h-14 w-14 items-center
                                justify-center rounded-2xl bg-violet-100">
                  <Users className="h-7 w-7 text-violet-600" />
                </div>

                <p className="font-semibold text-zinc-800">
                  No members yet
                </p>

               
              </div>
            )}
          </div>
        </div>

       
        <div className="border-t border-violet-100 bg-white px-6 py-4">
          <p className="text-center text-xs text-zinc-400">
            {isAdmin
              ? "You can manage viewer and editor permissions."
              : "Contact a room administrator to change your permissions."}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserList;
