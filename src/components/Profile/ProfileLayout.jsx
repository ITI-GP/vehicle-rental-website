import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';

export default function ProfileLayout() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if current language is RTL
  const isRTL = i18n.dir() === 'rtl';

  // Default roles (isOwner is true by default)
  const userRoles = {
    isCompany: user?.user_metadata?.isCompany || false,
    // isRenter: user?.user_metadata?.isRenter || false,
    isOwner: user?.user_metadata?.isOwner || false,
    isRenter: user?.user_metadata?.  isRenter?? true // Default to true if not specified
  };

  // Navigation items based on user roles
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊', roles: ['owner', 'renter', 'company'] },
    { 
      id: 'rented', 
      label: 'Rented Cars', 
      icon: '🚗', 
      roles: ['renter'],
      count: 0 // You can fetch actual count later
    },
    { 
      id: 'listings', 
      label: 'My Listings', 
      icon: '🏷️', 
      roles: ['owner', 'company'],
      count: 0
    },
    { 
      id: 'favorites', 
      label: 'Favorites', 
      icon: '❤️', 
      roles: ['renter'],
      count: 0
    },
    // { 
    //   id: 'notifications', 
    //   label: 'Notifications', 
    //   icon: '🔔', 
    //   roles: ['owner', 'renter', 'company'],
    //   count: 0
    // },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️', 
      roles: ['owner', 'renter', 'company']
    }
  ].filter(item => {
    // Filter navigation items based on user roles
    if (userRoles.isCompany) return item.roles.includes('company');
    if (userRoles.isRenter) return item.roles.includes('renter');
    return item.roles.includes('owner');
  });

  // Set first available tab as active if current active tab is not in filtered nav items
  useEffect(() => {
    if (!navItems.some(item => item.id === activeTab) && navItems.length > 0) {
      setActiveTab(navItems[0].id);
    }
  }, [navItems, activeTab]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`md:hidden fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 p-2 rounded-lg bg-white shadow-md`}
        aria-label={t('common.menu', 'Menu')}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`flex flex-col md:flex-row flex-1 pt-16`}>
        {/* Sidebar */}
        <ProfileSidebar 
          user={user} 
          navItems={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
          isRTL={isRTL}
        />
        
        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-8 ${isRTL ? 'md:mr-6' : 'md:ml-6'}`}>
          <ProfileContent 
            activeTab={activeTab} 
            user={user} 
            userRoles={userRoles} 
          />
        </main>
      </div>
    </div>
  );
}
