import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"


interface CreateProgramModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (programName: string) => void
  title:string
}

export default function CreateProgramModal({ open, onOpenChange, onSuccess,title }: CreateProgramModalProps) {
  const [programName, setProgramName] = useState("")
  const [startingDate, setStartingDate] = useState("Today")
  const [description, setDescription] = useState("")
  const [assignedPerson, setAssignedPerson] = useState("me")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (programName.trim()) {
      onSuccess(programName)
      // Reset form
      setProgramName("")
      setDescription("")
      setStartingDate("Today")
      setAssignedPerson("me")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-[400px] p-0 bg-white border border-[#E2E8F0]">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Program details</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Program Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter Client Company name"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="h-10 border border-[#E2E8F0] mt-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Starting Date</label>
              <div className="relative">
                <Input value={startingDate} onChange={(e) => setStartingDate(e.target.value)} className="h-10 pr-10 border-[#E2E8F0] mt-2" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Program Description</label>
              <Textarea
                placeholder="Enter a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] resize-none border-[#E2E8F0] mt-2"
              />
            </div>

            <div className="space-y-2 ">
              <label className="text-sm font-medium text-gray-900">Assign People</label>
              <Select value={assignedPerson} onValueChange={setAssignedPerson} >
                <SelectTrigger className="h-10 border-[#E2E8F0] mt-2 cursor-pointer w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E2E8F0]">
                  <SelectItem value="me">Me</SelectItem>
                  <SelectItem value="kathryn">Kathryn Murphy</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Assigned Preview</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/professional-woman.png" />
                  <AvatarFallback>KM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">Kathryn Murphy</div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 bg-transparent border-[#E2E8F0] cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-10 bg-[#1C73E0] hover:bg-blue-600 text-white cursor-pointer">
              Create Program
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
