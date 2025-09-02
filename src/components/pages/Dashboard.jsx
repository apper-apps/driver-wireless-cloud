import { useState, useEffect } from "react";
import tasksService from "@/services/api/tasksService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
const tasksData = await tasksService.getAll();
      setTasks(tasksData);
    } catch (error) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
const react = tasks.filter(task => task.taskType === "React").length;
    const maintain = tasks.filter(task => task.taskType === "Maintain").length;
    const improve = tasks.filter(task => task.taskType === "Improve").length;
    const todo = tasks.filter(task => task.status === "To Do").length;
    const inProgress = tasks.filter(task => task.status === "In Progress").length;
    const done = tasks.filter(task => task.status === "Done").length;

    return { total, react, maintain, improve, todo, inProgress, done };
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const upcoming = tasks
      .filter(task => {
const dueDate = new Date(task.dueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7 && task.status !== "Done";
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    return upcoming;
  };

  const getRecentActivity = () => {
    return tasks
.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  };

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = getTaskStats();
  const upcomingTasks = getUpcomingTasks();
  const recentActivity = getRecentActivity();

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
          Operations Dashboard
        </h1>
        <p className="text-slate-600">
          Monitor your business operations and task progress at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">React Tasks</p>
                <p className="text-3xl font-bold text-red-700">{stats.react}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">Maintain Tasks</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.maintain}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Improve Tasks</p>
                <p className="text-3xl font-bold text-green-700">{stats.improve}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="BarChart3" className="h-5 w-5 text-primary-600" />
            Task Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <p className="text-2xl font-bold text-gray-700 mb-1">{stats.todo}</p>
              <p className="text-sm text-gray-600">To Do</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-2xl font-bold text-blue-700 mb-1">{stats.inProgress}</p>
              <p className="text-sm text-blue-600">In Progress</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <p className="text-2xl font-bold text-green-700 mb-1">{stats.done}</p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Clock" className="h-5 w-5 text-primary-600" />
                Upcoming Tasks
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>
                View All
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No upcoming tasks in the next 7 days</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.Id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
<p className="font-medium text-slate-800 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
<Badge variant={getTaskTypeColor(task.taskType)} className="text-xs">
                          {task.taskType}
                        </Badge>
                        <span className="text-xs text-slate-500">
Due {format(new Date(task.dueDate), "MMM dd")}
                        </span>
                      </div>
                    </div>
<Badge variant={getStatusVariant(task.status)} className="ml-2">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Activity" className="h-5 w-5 text-primary-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((task) => (
                  <div
                    key={task.Id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
<p className="font-medium text-slate-800 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
<Badge variant={getTaskTypeColor(task.taskType)} className="text-xs">
                          {task.taskType}
                        </Badge>
<span className="text-xs text-slate-500">
                          Updated {format(new Date(task.updatedAt), "MMM dd, h:mm a")}
                        </span>
                      </div>
                    </div>
<Badge variant={getStatusVariant(task.status)} className="ml-2">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-xl bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-primary-800 mb-1">
                Ready to manage your operations?
              </h3>
              <p className="text-primary-600">
                Create new tasks, manage existing ones, and keep your business running smoothly.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate("/tasks")} 
                className="shadow-lg whitespace-nowrap"
              >
                <ApperIcon name="CheckSquare" className="h-4 w-4 mr-2" />
                Manage Tasks
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;