import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "React",
    assignee: "",
    dueDate: "",
    status: "To Do"
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
title: task.title || "",
        description: task.description || "",
        taskType: task.taskType || "React",
        assignee: task.assignee || "",
        dueDate: task.dueDate || "",
        status: task.status || "To Do"
      });
    } else {
      setFormData({
        title: "",
        description: "",
        taskType: "React",
        assignee: "",
        dueDate: "",
        status: "To Do"
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.assignee.trim()) {
      newErrors.assignee = "Assignee is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success(task ? "Task updated successfully!" : "Task created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleBackdropClick}
      >
        <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className={cn(
          "inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform",
          "bg-white shadow-2xl rounded-2xl border border-slate-200",
          "sm:max-w-lg"
        )}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              {task ? "Edit Task" : "Create New Task"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-slate-100"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField 
              label="Task Title" 
              required
              error={errors.title}
            >
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
              />
            </FormField>

            <FormField 
              label="Description" 
              required
              error={errors.description}
            >
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the task details"
                rows={3}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Task Type" required>
                <Select
                  name="taskType"
                  value={formData.taskType}
                  onChange={handleChange}
                >
                  <option value="React">React (Urgent)</option>
                  <option value="Maintain">Maintain (Ongoing)</option>
                  <option value="Improve">Improve (Enhancement)</option>
                </Select>
              </FormField>

              <FormField label="Status" required>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </Select>
              </FormField>
            </div>

            <FormField 
              label="Assignee" 
              required
              error={errors.assignee}
            >
              <Input
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                placeholder="Who is responsible for this task?"
              />
            </FormField>

            <FormField 
              label="Due Date" 
              required
              error={errors.dueDate}
            >
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </FormField>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  task ? "Update Task" : "Create Task"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;