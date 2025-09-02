import maintainTasks from '@/services/mockData/maintainTasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MaintainTasksService {
  constructor() {
    this.taskType = 'Maintain';
    this.data = [...maintainTasks];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const task = this.data.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      Id: Date.now(),
      Name: taskData.title,
      title_c: taskData.title,
      description_c: taskData.description,
      task_type_c: 'Maintain',
      assignee_c: taskData.assignee,
      due_date_c: taskData.dueDate,
      status_c: taskData.status || 'To Do',
      created_at_c: new Date().toISOString(),
      updated_at_c: new Date().toISOString()
    };
    
    this.data.push(newTask);
    return {
      Id: newTask.Id,
      title: newTask.title_c,
      description: newTask.description_c,
      taskType: newTask.task_type_c,
      assignee: newTask.assignee_c,
      dueDate: newTask.due_date_c,
      status: newTask.status_c,
      createdAt: newTask.created_at_c,
      updatedAt: newTask.updated_at_c
    };
  }

  async update(id, taskData) {
    await delay(350);
    const index = this.data.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;

    const updatedTask = {
      ...this.data[index],
      Name: taskData.title,
      title_c: taskData.title,
      description_c: taskData.description,
      assignee_c: taskData.assignee,
      due_date_c: taskData.dueDate,
      status_c: taskData.status,
      updated_at_c: new Date().toISOString()
    };

    this.data[index] = updatedTask;
    return {
      Id: updatedTask.Id,
      title: updatedTask.title_c,
      description: updatedTask.description_c,
      taskType: updatedTask.task_type_c,
      assignee: updatedTask.assignee_c,
      dueDate: updatedTask.due_date_c,
      status: updatedTask.status_c,
      createdAt: updatedTask.created_at_c,
      updatedAt: updatedTask.updated_at_c
    };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return false;
    
    this.data.splice(index, 1);
    return true;
  }

  async getByStatus(status) {
    await delay(300);
    return this.data
      .filter(task => task.status_c === status)
      .map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        taskType: task.task_type_c,
        assignee: task.assignee_c,
        dueDate: task.due_date_c,
        status: task.status_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c
      }));
  }
}

export default new MaintainTasksService();