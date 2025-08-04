import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ className = "" }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast.error(`Logout failed: ${error}`);
    } else {
      toast.success('Logged out successfully!');
      navigate('/');
    }
  };

  // Don't show logout button if user is not authenticated
  if (!user) return null;

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className}`}
    >
      Logout
    </button>
  );
}
