class TasksService {
  constructor() {
    this.tableName = 'task_c';
    this.apperClient = null;
    this.initializeClient();
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

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "task_type_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match expected structure
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        taskType: task.task_type_c,
        assignee: task.assignee_c,
        dueDate: task.due_date_c,
        status: task.status_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "task_type_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      const task = response.data;
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
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          task_type_c: taskData.taskType,
          assignee_c: taskData.assignee,
          due_date_c: taskData.dueDate,
          status_c: taskData.status,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
        }

        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || createdTask.Name,
            description: createdTask.description_c,
            taskType: createdTask.task_type_c,
            assignee: createdTask.assignee_c,
            dueDate: createdTask.due_date_c,
            status: createdTask.status_c,
            createdAt: createdTask.created_at_c,
            updatedAt: createdTask.updated_at_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      return null;
    }
  }

  async update(id, taskData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          task_type_c: taskData.taskType,
          assignee_c: taskData.assignee,
          due_date_c: taskData.dueDate,
          status_c: taskData.status,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
        }

        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || updatedTask.Name,
            description: updatedTask.description_c,
            taskType: updatedTask.task_type_c,
            assignee: updatedTask.assignee_c,
            dueDate: updatedTask.due_date_c,
            status: updatedTask.status_c,
            createdAt: updatedTask.created_at_c,
            updatedAt: updatedTask.updated_at_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  }

  async getByType(taskType) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "task_type_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "task_type_c",
            Operator: "EqualTo",
            Values: [taskType]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        taskType: task.task_type_c,
        assignee: task.assignee_c,
        dueDate: task.due_date_c,
        status: task.status_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by type:", error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "task_type_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        taskType: task.task_type_c,
        assignee: task.assignee_c,
        dueDate: task.due_date_c,
        status: task.status_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  }
}
export default new TasksService();