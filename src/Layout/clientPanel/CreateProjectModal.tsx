/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, MapPin } from "lucide-react";
import { useCreateProjectMutation } from "@/store/Api/ProjectApi/ProjectApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RepeatEvery = "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
type Priority = "LOW" | "MEDIUM" | "HIGH";

interface CreateProjectForm {
  name: string;
  message: string;
  programId: string;
  description?: string;
  repeatEvery: RepeatEvery;
  repeatOnDays: string[];
  repeatOnDates: number[];
  remindBefore: number;
  priority: Priority;
  startDate: string;
  deadline: string;
  estimatedCompletedDate: string;
  managerId?: string;
  employeeIds: string[];
  currentRate: string;
  budget: string;
  latitude: number;
  longitude: number;
}

interface CreateProjectModalProps {
  open: boolean;
  programId: string;
  onClose: () => void;
}

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function CreateProjectModal({
  open,
  programId,
  onClose,
}: CreateProjectModalProps) {
  const [createProject, { isLoading, isSuccess }] = useCreateProjectMutation();

  const { register, handleSubmit, watch, setValue, reset, control } =
    useForm<CreateProjectForm>({
      defaultValues: {
        programId,
        managerId:"",
        repeatEvery: "WEEKLY",
        repeatOnDays: ["MONDAY"],
        repeatOnDates: [],
        remindBefore: 30,
        priority: "MEDIUM",
        latitude: 37.7749,
        longitude: -122.4194,
        employeeIds: [],
      },
    });

  const repeatEvery = watch("repeatEvery");
  const repeatOnDays = watch("repeatOnDays");

  useEffect(() => {
    if (isSuccess) {
      reset();
      onClose();
    }
  }, [isSuccess, reset, onClose]);

  const toggleDay = (day: string) => {
    setValue(
      "repeatOnDays",
      repeatOnDays.includes(day)
        ? repeatOnDays.filter((d) => d !== day)
        : [...repeatOnDays, day]
    );
  };

  const toISO = (date: string) => (date ? new Date(date).toISOString() : null);

  const onSubmit = (data: CreateProjectForm) => {
    createProject({
      ...data,
      isActive: true,
      progress: 0,
      chartList: ["string"],
      startDate: toISO(data.startDate),
      deadline: toISO(data.deadline),
      estimatedCompletedDate: toISO(data.estimatedCompletedDate),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-4xl rounded-2xl p-6">
        <DialogHeader className="flex justify-between items-center border-b pb-4">
          <DialogTitle className="text-2xl font-semibold">
            Create New Project
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" className="p-2">
              <X size={24} />
            </Button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
          {/* Project Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Project Name</Label>
                <Input
                  {...register("name", { required: true })}
                  placeholder="Project name"
                />
              </div>

              <div>
                <Label>Project Message</Label>
                <Input {...register("message")} placeholder="Project message" />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Description"
                  className="resize-none h-28"
                />
              </div>

              <div>
                <Label>Repeat Cycle</Label>
                <Controller
                  control={control}
                  name="repeatEvery"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-4 mt-2"
                    >
                      {["WEEKLY", "BI_WEEKLY", "MONTHLY"].map((val) => (
                        <div key={val} className="flex items-center gap-2">
                          <RadioGroupItem value={val} id={val} />
                          <Label htmlFor={val}>{val.replace("_", " ")}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>

              {repeatEvery !== "MONTHLY" && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {DAYS.map((day) => (
                    <Button
                      key={day}
                      variant={
                        repeatOnDays.includes(day) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleDay(day)}
                      className="px-3 py-1 text-xs"
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {[
                ["startDate", "Start Date"],
                ["deadline", "Deadline"],
                ["estimatedCompletedDate", "Estimated Completion"],
              ].map(([field, label]) => (
                <div key={field}>
                  <Label>{label}</Label>
                  <Input type="date" {...register(field as any)} />
                </div>
              ))}

              <div>
                <Label>Remind Before (minutes)</Label>
                <Input type="number" {...register("remindBefore")} />
              </div>

              <div>
                <Label>Priority</Label>
                <Select {...register("priority")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Current Rate</Label>
                <Input
                  {...register("currentRate")}
                  placeholder="Current rate"
                />
              </div>

              <div>
                <Label>Budget</Label>
                <Input {...register("budget")} placeholder="Budget" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin size={16} /> Location
            </Label>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                type="number"
                step="any"
                {...register("latitude")}
                placeholder="Latitude"
              />
              <Input
                type="number"
                step="any"
                {...register("longitude")}
                placeholder="Longitude"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
