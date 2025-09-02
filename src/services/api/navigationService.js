class NavigationService {
  constructor() {
    this.tableName = 'navigation_c';
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
          { field: { Name: "label_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "to_c" } },
          { field: { Name: "children_c" } },
          { field: { Name: "is_active_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match expected structure
      return response.data?.map(item => ({
        Id: item.Id,
        label: item.label_c || item.Name,
        path: item.to_c,
        icon: item.icon_c,
        children: this.parseChildren(item.children_c) || []
      })) || [];
    } catch (error) {
      console.error("Error fetching navigation:", error);
      return [];
    }
  }

  parseChildren(childrenData) {
    if (!childrenData) return [];
    try {
      return typeof childrenData === 'string' ? JSON.parse(childrenData) : childrenData;
    } catch {
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
          { field: { Name: "label_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "to_c" } },
          { field: { Name: "children_c" } },
          { field: { Name: "is_active_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        label: item.label_c || item.Name,
        path: item.to_c,
        icon: item.icon_c,
        children: this.parseChildren(item.children_c) || []
      };
    } catch (error) {
      console.error(`Error fetching navigation with ID ${id}:`, error);
      return null;
    }
  }
}

export default new NavigationService();