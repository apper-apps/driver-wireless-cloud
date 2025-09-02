import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getTaskTypeColor = (type) => {
    switch (type) {
      case "React": return "react";
      case "Maintain": return "maintain";
      case "Improve": return "improve";
      default: return "default";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "To Do": return "todo";
      case "In Progress": return "progress";
      case "Done": return "done";
      default: return "default";
    }
  };

  const getDueDateColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 3) return "text-orange-600";
    return "text-slate-600";
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
<h3 className="font-semibold text-slate-800 mb-2">{task.title || task.title_c}</h3>
            <div className="flex items-center gap-2">
<Badge variant={getTaskTypeColor(task.taskType || task.task_type_c)}>
                {task.taskType || task.task_type_c}
              </Badge>
              <Badge variant={getStatusVariant(task.status || task.status_c)}>
                {task.status || task.status_c}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
            >
              <ApperIcon name="Edit2" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task)}
              className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
<p className="text-slate-600 text-sm mb-4 line-clamp-2">{task.description || task.description_c}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-600">
            <ApperIcon name="User" className="h-4 w-4 mr-2" />
<span>{task.assignee || task.assignee_c}</span>
          </div>
          
<div className={`flex items-center text-sm ${getDueDateColor(task.dueDate)}`}>
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            <span>Due {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;