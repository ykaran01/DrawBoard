import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const UserList = ({ open, setOpen, users = [] }) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[400px] bg-purple-100 border-l border-zinc-200 p-6 flex flex-col justify-between">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl flex justify-center font-extrabold text-purple-600 tracking-tight">
             Users 
          </SheetTitle>
        </SheetHeader>

        
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto py-2 pr-1">
          {users.map((item, index) => (
            <div 
              key={item.id || item.username || index} 
              className="bg-[#f3ebfc] rounded-xl p-3 border border-[#e3d5f7] shadow-xs hover:bg-[#ebdcfc] transition-colors duration-150"
            >
              <div className="flex gap-4 items-center">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full border border-purple-200 object-cover" 
                />
                <div className="flex flex-col ">
                  <h3 className="text-sm font-bold text-purple-600 truncate">
                    @{item.username}
                  </h3>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7d6b99] truncate">
                    {item.name}
                  </h4>
                </div>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-4">No other users in this room.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default UserList;