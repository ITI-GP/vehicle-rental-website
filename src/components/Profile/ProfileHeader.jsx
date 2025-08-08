import { useState } from 'react';
import { PencilIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

export default function ProfileHeader({ user, onEditProfile, isEditing, onSave, onCancel, formData, setFormData, isSaving }) {
  const { t, i18n } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const isRTL = i18n.dir() === 'rtl';

  // Focus on name input when editing starts
  useEffect(() => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.focus();
    }
  }, [isEditing]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB) and type
    if (file.size > 5 * 1024 * 1024) {
      alert(t('profile.imageSizeError', 'Image size should be less than 5MB'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert(t('profile.imageTypeError', 'Please select a valid image file'));
      return;
    }

    setIsUploading(true);
    try {
      // In a real app, you would upload the image to your storage service
      // and get back a URL to use as the avatar
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert(t('profile.imageUploadError', 'Error uploading image'));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(t('profile.imageUploadError', 'Error uploading image'));
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const userRoles = [];
  if (user?.user_metadata?.isCompany) userRoles.push(t('profile.roles.company', 'Company'));
  if (user?.user_metadata?.isRenter) userRoles.push(t('profile.roles.renter', 'Renter'));
  if (user?.user_metadata?.isOwner !== false) userRoles.push(t('profile.roles.owner', 'Owner'));

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <div className="relative group">
                <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {formData?.image ? (
                    <img
                      className="h-full w-full object-cover"
                      src={formData.image}
                      alt={t('profile.profileImage', 'Profile image')}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-600 text-2xl font-medium">
                      {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className="bg-white rounded-full p-1.5 shadow-md cursor-pointer group-hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      aria-label={t('profile.changeImage', 'Change profile image')}
                    >
                      {isUploading ? (
                        <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <CameraIcon className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploading}
                    />
                  </div>
                )}
              </div>
              <div className="ml-4">
                {isEditing ? (
                  <div className="space-y-2 w-full">
                    <input
                      type="text"
                      value={formData?.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-xl font-medium text-gray-900 border rounded px-2 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={t('profile.fullName', 'Full Name')}
                      disabled={isSaving}
                      aria-label={t('profile.fullName', 'Full Name')}
                    />
                    <div className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {formData?.name || user?.email?.split('@')[0] || 'User'}
                    </h1>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{user?.email}</span>
                      {userRoles.length > 0 && (
                        <span className="mx-2">•</span>
                      )}
                      <span className="text-sm text-gray-600">
                        {userRoles.join(' • ')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={`mt-4 flex md:mt-0 ${isRTL ? 'md:mr-4' : 'md:ml-4'}`}>
            {isEditing ? (
              <div className={`flex flex-col space-y-2 w-full sm:flex-row sm:space-y-0 ${isRTL ? 'sm:space-x-reverse sm:space-x-2' : 'sm:space-x-2'}`}>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving || isUploading}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving || isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('common.saving', 'Saving...')}
                    </>
                  ) : (
                    t('common.saveChanges', 'Save Changes')
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
              >
                <PencilIcon className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t('profile.editProfile', 'Edit Profile')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
