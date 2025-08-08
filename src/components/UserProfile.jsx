import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { PencilIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { supabase } from '../Lib/supabaseClient';
import vehicleData from '../data/vehicles.json';
import VehiclesCard from './VehiclesCard/VehiclesCard';

export default function UserProfile() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    image: 'https://via.placeholder.com/150'
  });

  // Update formData when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        image: user.user_metadata?.avatar || 'https://via.placeholder.com/150'
      });
    }
  }, [user]);


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  // Mock user vehicles - replace with real data when available
  const userVehicles = vehicleData?.filter((v) => v.userId === 1) || [];

  const handleSave = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      // Update user metadata in Supabase
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          phone: formData.phone,
          avatar: formData.image
        }
      });

      if (error) {
        throw error;
      }

      // Show success message
      toast.success(t('profile.updateSuccess') || 'Profile updated successfully!');
      setIsOpen(false);
      
      // The AuthContext will automatically update with the new user data
      // due to the onAuthStateChange listener
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('profile.updateError') || `Failed to update profile: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    try {
      setIsUpdating(true);
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        setFormData((prev) => ({ ...prev, image: urlData.publicUrl }));
        toast.success('Image uploaded successfully!');
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to local preview if upload fails
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
      toast.warning('Image uploaded locally. Save profile to upload to server.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image: 'https://via.placeholder.com/150' }));
  };


  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">{t("auth.pleaseLoginToViewProfile")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-10">
        <img
          src={formData.image}
          alt="User"
          className="w-24 h-24 rounded-full object-cover border shadow"
        />
        <div>
          <h2 className="text-2xl font-semibold">
            {user.user_metadata?.name || t("profile.user")}
          </h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.user_metadata?.phone || 'No phone'}</p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/30"
          >
            <PencilIcon className="w-5 h-5" />
            {t("profile.editProfile")}
          </button>
        </div>
      </div>

      {/* Account Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("profile.accountStatus")}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("profile.userId")}:</span>
              <span className="font-medium text-xs">{user.id.substring(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("profile.accountCreated")}:</span>
              <span className="font-medium">{formatDate(user.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("profile.lastSignIn")}:</span>
              <span className="font-medium">{formatDate(user.last_sign_in_at)}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("profile.emailVerified")}:</span>
              <span className={`font-medium ${
                user.user_metadata?.email_verified ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {user.user_metadata?.email_verified ? t("profile.yes") : t("profile.no")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("profile.phoneVerified")}:</span>
              <span className={`font-medium ${
                user.user_metadata?.phone_verified ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {user.user_metadata?.phone_verified ? t("profile.yes") : t("profile.no")}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* User Vehicles */}
      <h3 className="text-xl font-semibold mb-6">Your Vehicles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {userVehicles.length > 0 ? (
          userVehicles.map((vehicle) => (
            <VehiclesCard key={vehicle.id} vehicle={vehicle} />
          ))
        ) : (
          <p className="text-gray-500 italic">You haven't added any vehicles yet.</p>
        )}
      </div>


      {/* Logout Button */}
      <div className="flex justify-center">
        <LogoutButton />
      </div>

      {/* Edit Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-md rounded-xl shadow-lg p-10">
            <Dialog.Title className="text-xl font-semibold mb-4">{t("profile.editProfile")}</Dialog.Title>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              {/* Image Preview + Upload */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={formData.image}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    />
                    {isUpdating && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isUpdating}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
                      disabled={isUpdating}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">{t("auth.fullName")}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={user.user_metadata?.name || 'Enter your name'}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">{t("auth.phone")}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={user.user_metadata?.phone || 'Enter your phone'}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
