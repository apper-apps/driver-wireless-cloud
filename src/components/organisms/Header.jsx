import { useContext } from 'react';
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from '../../App';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center gap-2">
      {user && (
        <span className="text-sm text-slate-600 hidden sm:block">
          {user.firstName} {user.lastName}
        </span>
      )}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="hover:bg-red-50 hover:text-red-600"
      >
        <ApperIcon name="LogOut" className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </div>
  );
};
const Header = ({ onMenuToggle, isMobileMenuOpen }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={onMenuToggle}
        >
          <ApperIcon 
            name={isMobileMenuOpen ? "X" : "Menu"} 
            className="h-6 w-6" 
          />
        </Button>

        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
            <ApperIcon name="Zap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              OPS Hub
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">Business Operations Management</p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

{/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-slate-100">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-slate-100">
            <ApperIcon name="Settings" className="h-5 w-5" />
          </Button>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;