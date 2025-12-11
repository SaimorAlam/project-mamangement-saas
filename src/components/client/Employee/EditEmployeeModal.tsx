/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IEmployee } from "@/types";
import { useCreateEmployeeMutation } from "@/store/Api/UserApi/UserApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditEmployeeModalProps {
  editEmployee?: IEmployee;
  onClose: () => void;
  onSubmitSuccess: (data: any) => void;
}

interface FormValues {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  skills: string[];
  description: string;
  joinedDate: string;
  projects: string[];
  sendWelcomeEmail: boolean;
  notifyProjectManager: boolean;
  role: string;
  level: string;
}

export default function EditEmployeeModal({
  editEmployee,
  onClose,
  onSubmitSuccess,
}: EditEmployeeModalProps) {
  const [createEmployee] = useCreateEmployeeMutation();
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState("");

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        skills: [],
        description: "",
        joinedDate: "",
        projects: [],
        sendWelcomeEmail: true,
        notifyProjectManager: false,
        role: "Viewer",
        level: "Active",
      },
    });

  const skills = watch("skills");
  const projects = watch("projects");

  useEffect(() => {
    if (editEmployee) {
      reset({
        ...editEmployee,
        password: "",
        skills: editEmployee.skills || [],
        projects: editEmployee.projects || [],
      });
    }
  }, [editEmployee, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (!editEmployee) {
        await createEmployee(data).unwrap();
      }
      onSubmitSuccess(data);
      onClose();
    } catch (error) {
      console.error("Failed to submit employee", error);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setValue("skills", [...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleAddProject = () => {
    if (newProject.trim()) {
      setValue("projects", [...projects, newProject.trim()]);
      setNewProject("");
    }
  };

  const handleRemoveItem = (arrName: "skills" | "projects", index: number) => {
    const arr = watch(arrName);
    setValue(
      arrName,
      arr.filter((_, i: number) => i !== index)
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.5)] backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editEmployee ? "Edit" : "Create"} Employee
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input {...register("name")} placeholder="John Doe" required />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              {...register("email")}
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <Input {...register("phoneNumber")} placeholder="25464654654" />
          </div>

          {/* Password */}
          {!editEmployee && (
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                {...register("password")}
                type="password"
                placeholder="password123"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              {...register("description")}
              placeholder="Job description..."
            />
          </div>

          {/* Joined Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Joined Date
            </label>
            <Input type="date" {...register("joinedDate")} />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select
              value={watch("role")}
              onValueChange={(v) => setValue("role", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Viewer">Viewer</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <Select
              value={watch("level")}
              onValueChange={(v) => setValue("level", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In Active">In Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("skills", idx)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">Add Skill</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Skill</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Enter skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <div className="flex justify-end mt-4 gap-2">
                  <Button type="button" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects */}
          <div>
            <label className="block text-sm font-medium mb-1">Projects</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {projects.map((proj, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                >
                  {proj}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("projects", idx)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">Add Project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Project</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Enter project ID"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                />
                <div className="flex justify-end mt-4 gap-2">
                  <Button type="button" onClick={handleAddProject}>
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("sendWelcomeEmail")} />
              Send Welcome Email
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("notifyProjectManager")} />
              Notify Project Manager
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editEmployee ? "Save" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
