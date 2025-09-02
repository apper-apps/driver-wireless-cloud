import { useEffect, useState } from "react";
import navigationService from "@/services/api/navigationService";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, className }) => {
  const [navigationItems, setNavigationItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const loadNavigation = async () => {
      try {
        const data = await navigationService.getAll();
        setNavigationItems(data);
      } catch (error) {
        console.error("Failed to load navigation:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNavigation();
  }, []);

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-600/20">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500 shadow-lg">
          <ApperIcon name="Zap" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">OPS Hub</h2>
          <p className="text-xs text-slate-300">Operations Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 sidebar-scroll overflow-y-auto">
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          navigationItems.map((item) => (
            <NavigationItem key={item.Id} item={item} />
          ))
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-600/20">
        <div className="text-center text-xs text-slate-400">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className={cn(
            "fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-slate-700 to-slate-800 shadow-2xl transition-transform duration-300 ease-out",
            "transform translate-x-0 flex flex-col",
            className
          )}>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:w-80 bg-gradient-to-b from-slate-700 to-slate-800 border-r border-slate-600/20",
        className
      )}>
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;