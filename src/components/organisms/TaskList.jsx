import { useState } from "react";
import { toast } from "react-toastify";
import TaskCard from "@/components/molecules/TaskCard";
import TaskModal from "@/components/organisms/TaskModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import tasksService from "@/services/api/tasksService";

const TaskList = ({ tasks, onTasksChange, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

setDeletingTaskId(task.Id);
    try {
      await tasksService.delete(task.Id);
      onTasksChange();
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleSaveTask = async (formData) => {
    if (editingTask) {
await tasksService.update(editingTask.Id, formData);
    } else {
      await tasksService.create(formData);
    }
    onTasksChange();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
          <div className="h-10 bg-slate-200 rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-card p-6">
              <div className="space-y-4">
                <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded-full w-16 animate-pulse" />
                  <div className="h-6 bg-slate-200 rounded-full w-20 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Task Management
          </h2>
          <p className="text-slate-600 mt-1">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
          </p>
        </div>
        <Button onClick={handleCreateTask} className="shadow-lg">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No tasks found</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Get started by creating your first task to organize your operations workflow.
          </p>
          <Button onClick={handleCreateTask} className="shadow-lg">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Create First Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.Id} className="relative">
              <TaskCard
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
              {deletingTaskId === task.Id && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <ApperIcon name="Loader2" className="h-6 w-6 animate-spin text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TaskList;