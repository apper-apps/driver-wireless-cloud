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
      // Return static navigation structure as requested
      return [
        {
          Id: 1,
          label: "Dashboard",
          path: "/",
          icon: "LayoutDashboard",
          children: []
        },
        {
          Id: 2,
          label: "Tasks",
          path: "#",
          icon: "CheckSquare",
          children: [
            {
              Id: 21,
              label: "React",
              path: "/tasks?filter=React",
              icon: "AlertTriangle",
              children: []
            },
            {
              Id: 22,
              label: "Maintain",
              path: "/tasks?filter=Maintain",
              icon: "Settings",
              children: []
            },
            {
              Id: 23,
              label: "Improve",
              path: "/tasks?filter=Improve",
              icon: "TrendingUp",
              children: []
            }
          ]
        },
        {
          Id: 3,
          label: "Toolbox",
          path: "#",
          icon: "Wrench",
          children: [
            {
              Id: 31,
              label: "Systems",
              path: "/systems",
              icon: "Server",
              children: []
            },
            {
              Id: 32,
              label: "Processes",
              path: "/processes",
              icon: "GitBranch",
              children: []
            },
            {
              Id: 33,
              label: "Equipment",
              path: "/equipment",
              icon: "Cog",
              children: []
            },
            {
              Id: 34,
              label: "Software",
              path: "/software",
              icon: "Monitor",
              children: []
            },
            {
              Id: 35,
              label: "Team",
              path: "/team",
              icon: "Users",
              children: []
            },
            {
              Id: 36,
              label: "Key Events",
              path: "/key-events",
              icon: "Calendar",
              children: []
            },
            {
              Id: 37,
              label: "Ideas",
              path: "/ideas",
children: []
            }
          ]
        },
        {
          Id: 4,
          label: "Reports",
          path: "/reports",
          icon: "BarChart3",
children: []
        }
      ];
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