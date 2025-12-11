import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreateProgramMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { toast } from "sonner";

interface ICreateProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (programName: string) => void;
  title: string;
}

interface ProgramFormData {
  programName: string;
  startingDate: string;
  description: string;
  // assignedPerson: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  deadline: string;
}

export default function CreateProgramModal({
  open,
  onOpenChange,
  onSuccess,
  title,
}: ICreateProgramModalProps) {
  const [createProgramMutation] = useCreateProgramMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProgramFormData>({
    defaultValues: {
      programName: "",
      startingDate: "",
      description: "",
      // assignedPerson: "me",
      priority: "HIGH",
      deadline: "",
    },
  });

  const onSubmit = async (data: ProgramFormData) => {
    const payload = {
      programName: data.programName,
      datetime: data.startingDate
        ? new Date(data.startingDate).toISOString()
        : new Date().toISOString(),
      programDescription: data.description,
      priority: data.priority,
      deadline: data.deadline
        ? new Date(data.deadline).toISOString()
        : undefined,
      // assignedPerson: data.assignedPerson,
    };
    try {
      const res = await createProgramMutation(payload).unwrap();
      if (res.success) {
        toast.success("Program created successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create program");
    }
    onSuccess(data.programName);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 bg-white border border-[#E2E8F0]">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-700">Program details</h3>

          {/* Program Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Program Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("programName", {
                required: "Program Name is required",
              })}
              placeholder="Enter Program Name"
              className="h-10 border border-[#E2E8F0] mt-2"
            />
            {errors.programName && (
              <p className="text-red-500 text-sm">
                {errors.programName.message}
              </p>
            )}
          </div>

          {/* Starting Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Starting Date
            </label>
            <Input
              type="datetime-local"
              {...register("startingDate")}
              className="h-10 border border-[#E2E8F0] mt-2"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Program Description
            </label>
            <Textarea
              {...register("description")}
              placeholder="Enter a description..."
              className="min-h-20 resize-none border-[#E2E8F0] mt-2"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Priority
            </label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 border border-[#E2E8F0] mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#E2E8F0]">
                    <SelectItem value="HIGH">HIGH</SelectItem>
                    <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                    <SelectItem value="LOW">LOW</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Deadline
            </label>
            <Input
              type="datetime-local"
              {...register("deadline")}
              className="h-10 border border-[#E2E8F0] mt-2"
            />
          </div>

          {/* Assigned Person */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Assign Person
            </label>
            <Controller
              control={control}
              name="assignedPerson"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 border border-[#E2E8F0] mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#E2E8F0]">
                    <SelectItem value="me">Me</SelectItem>
                    <SelectItem value="kathryn">Kathryn Murphy</SelectItem>
                    <SelectItem value="john">John Doe</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div> */}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 bg-transparent border-[#E2E8F0] cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 bg-[#1C73E0] hover:bg-blue-600 text-white cursor-pointer"
            >
              Create Program
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
