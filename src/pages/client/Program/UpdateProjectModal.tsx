/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { UpdateProjectPayload } from "@/types/Projects";
import { useGetAllManagersQuery } from "@/store/Api/UserApi/UserApi";

interface UpdateProjectModalProps {
  open: boolean;
  project: any;
  onClose: () => void;
  onSubmit: (payload: UpdateProjectPayload) => Promise<void>;
}

/* ---------- helpers ---------- */
const toInputDate = (iso?: string) =>
  iso ? new Date(iso).toISOString().split("T")[0] : "";

const toISODate = (date?: string) =>
  date ? new Date(`${date}T00:00:00Z`).toISOString() : undefined;

export default function UpdateProjectModal({
  open,
  project,
  onClose,
  onSubmit,
}: UpdateProjectModalProps) {
  const { data: managers } = useGetAllManagersQuery({});

  const allManagers =
    managers?.data?.data.map((m: any) => ({
      id: m.id,
      name: m.user.name,
    })) ?? [];

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      priority: "MEDIUM",
      startDate: "",
      deadline: "",
      projectCompleteDate: "",
      progress: 0,
      currentRate: "",
      budget: "",
      latitude: 0,
      longitude: 0,
      managerId: "",
    },
  });

  const progress = watch("progress");

  /* ---------- hydrate form ---------- */
  useEffect(() => {
    if (!project) return;

    reset({
      name: project.name ?? "",
      description: project.description ?? "",
      priority: project.priority ?? "MEDIUM",
      startDate: toInputDate(project.startDate),
      deadline: toInputDate(project.deadline),
      projectCompleteDate: toInputDate(project.projectCompleteDate),
      progress: project.progress ?? 0,
      currentRate: project.currentRate ?? "",
      budget: project.budget ?? "",
      latitude: project.latitude ?? 0,
      longitude: project.longitude ?? 0,
      managerId: project.managerId ?? "",
    });
  }, [project, reset]);

  /* ---------- submit ---------- */
  const submitHandler = async (data: UpdateProjectPayload) => {
    const payload: any = {
      ...data,
      progress: Number(data.progress),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      startDate: toISODate(data.startDate),
      deadline: toISODate(data.deadline),
      projectCompleteDate: toISODate(data.projectCompleteDate),
    };

    if (!payload.managerId?.trim()) {
      delete payload.managerId;
    }

    await onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-3xl rounded-2xl p-6">
        <DialogHeader className="flex justify-between items-center border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Update Project
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" className="p-2">
              <X size={20} />
            </Button>
          </DialogClose>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submitHandler as any)}
          className="space-y-6 mt-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Project Name</Label>
              <Input {...register("name", { required: true })} />
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Label>Priority</Label>
                <Select
                  value={watch("priority")}
                  onValueChange={(v) => setValue("priority", v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <Label>Manager</Label>
                <Select
                  value={watch("managerId")}
                  onValueChange={(v) => setValue("managerId", v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allManagers.map((m: any) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Start Date</Label>
              <Input type="date" {...register("startDate")} />
            </div>

            <div>
              <Label>Deadline</Label>
              <Input type="date" {...register("deadline")} />
            </div>

            <div>
              <Label>Completion Date</Label>
              <Input type="date" {...register("projectCompleteDate")} />
            </div>

            <div>
              <Label>Progress</Label>
              <Input
                type="number"
                min={0}
                max={100}
                {...register("progress")}
              />
              <div className="mt-2">
                <Progress value={progress} />
              </div>
            </div>

            <div>
              <Label>Current Rate</Label>
              <Input {...register("currentRate")} />
            </div>

            <div>
              <Label>Budget</Label>
              <Input {...register("budget")} />
            </div>

            <div>
              <Label>Latitude</Label>
              <Input type="number" step="any" {...register("latitude")} />
            </div>

            <div>
              <Label>Longitude</Label>
              <Input type="number" step="any" {...register("longitude")} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              className="resize-none h-24"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
