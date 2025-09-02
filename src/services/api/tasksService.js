import reactTasksService from "./reactTasksService";
import maintainTasksService from "./maintainTasksService";
import improveTasksService from "./improveTasksService";

class TasksService {
  constructor() {
    this.services = {
      'React': reactTasksService,
      'Maintain': maintainTasksService,
      'Improve': improveTasksService
    };
  }

  getServiceByType(taskType) {
    return this.services[taskType] || reactTasksService;
  }

  initializeClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

async getAll() {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }
      // Get all tasks from all three services
      const [reactTasks, maintainTasks, improveTasks] = await Promise.all([
        reactTasksService.getAll(),
        maintainTasksService.getAll(),
        improveTasksService.getAll()
      ]);

      // Combine and transform the data
      const allTasks = [
        ...reactTasks.map(task => this.transformTask(task)),
        ...maintainTasks.map(task => this.transformTask(task)),
        ...improveTasks.map(task => this.transformTask(task))
      ];

      return allTasks;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      return [];
    }
  }

transformTask(task) {
    return {
      Id: task.Id,
      title: task.title_c || task.Name,
      description: task.description_c,
      taskType: task.task_type_c,
      assignee: task.assignee_c,
      dueDate: task.due_date_c,
      status: task.status_c,
      createdAt: task.created_at_c,
      updatedAt: task.updated_at_c
    };
  }

async getById(id) {
    try {
      // Try to find the task in all three services
      let task = await reactTasksService.getById(id);
      if (!task) task = await maintainTasksService.getById(id);
      if (!task) task = await improveTasksService.getById(id);

      if (!task) return null;

      return this.transformTask(task);
    } catch (error) {
      console.error("Error fetching task by ID:", error);
      return null;
    }
  }

async create(taskData) {
    try {
      const service = this.getServiceByType(taskData.taskType);
      return await service.create(taskData);
    } catch (error) {
      console.error("Error creating task:", error);
      return null;
    }
  }

async update(id, taskData) {
    try {
      // Find which service contains the task
      let service = null;
      let task = await reactTasksService.getById(id);
      if (task) {
        service = reactTasksService;
      } else {
        task = await maintainTasksService.getById(id);
        if (task) {
          service = maintainTasksService;
        } else {
          task = await improveTasksService.getById(id);
          if (task) {
            service = improveTasksService;
          }
        }
      }

      if (!service) return null;
      return await service.update(id, taskData);
    } catch (error) {
      console.error("Error updating task:", error);
      return null;
    }
  }

  async delete(id) {
    try {
      // Try to delete from all services
      const results = await Promise.all([
        reactTasksService.delete(id).catch(() => false),
        maintainTasksService.delete(id).catch(() => false),
        improveTasksService.delete(id).catch(() => false)
      ]);

      return results.some(result => result === true);
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  }

  async getByType(taskType) {
    try {
      const service = this.getServiceByType(taskType);
      const tasks = await service.getAll();
      return tasks.map(task => this.transformTask(task));
    } catch (error) {
      console.error("Error fetching tasks by type:", error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      // Get tasks from all services and filter by status
      const [reactTasks, maintainTasks, improveTasks] = await Promise.all([
        reactTasksService.getByStatus(status),
        maintainTasksService.getByStatus(status),
        improveTasksService.getByStatus(status)
      ]);

      const allTasks = [
        ...reactTasks.map(task => this.transformTask(task)),
        ...maintainTasks.map(task => this.transformTask(task)),
        ...improveTasks.map(task => this.transformTask(task))
      ];

      return allTasks;
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  }
}

export default new TasksService();