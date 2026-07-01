import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"

const UserProfile = ({open,setopen}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Title</PopoverTitle>
                    <PopoverDescription>Description text here.</PopoverDescription>
                </PopoverHeader>
            </PopoverContent>
        </Popover>
    )
}

export default UserProfile