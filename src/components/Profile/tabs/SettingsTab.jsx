import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../Lib/supabaseClient';

// Import CameraIcon (assuming you're using Heroicons; adjust if using a different icon library)
import { CameraIcon } from '@heroicons/react/24/solid';

const SettingsTab = ({ user, onSave, formData, setFormData, isSaving, onFileUpload }) => {
  const { t } = useTranslation();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle input changes for profile info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (passwordError) setPasswordError('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t('profile.settings.passwordsDontMatch', 'Passwords do not match'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(t('profile.settings.passwordTooShort', 'Password must be at least 6 characters'));
      return;
    }

    setIsPasswordSaving(true);
    setPasswordError('');

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      // Show success message and clear form
      setPasswordSuccess(t('profile.settings.passwordUpdated', 'Password updated successfully!'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => setPasswordSuccess(''), 5000);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error.message || t('profile.settings.passwordUpdateError', 'Failed to update password'));
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // Handle file upload using the parent's upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Use the parent's file upload handler which should handle the storage upload
      // and return the public URL
      const { publicUrl, error: uploadError } = await onFileUpload(file);

      if (uploadError) {
        throw new Error(uploadError.message || 'Failed to upload image');
      }

      if (!publicUrl) {
        throw new Error('Failed to get image URL');
      }

      // The parent component should handle updating the user's metadata
      // with the new avatar URL. We just need to update the local form data.
      setFormData((prev) => ({
        ...prev,
        avatar_url: publicUrl,
      }));

      toast.success(t('profile.settings.profilePictureUpdated', 'Profile picture updated successfully!'));
    } catch (error) {
      console.error('Error in handleFileChange:', error);
      toast.error(error.message || t('profile.settings.uploadError', 'Failed to upload image'));
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {t('profile.settings.title', 'Account Settings')}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('profile.settings.description', 'Manage your account settings and preferences')}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('profile.settings.profile', 'Profile Information')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('profile.settings.profileDescription', 'Update your account information')}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {/* Avatar Upload */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t('profile.settings.profilePicture', 'Profile Picture')}
              </dt>
              <dd className="mt-1 flex items-center space-x-4 sm:mt-0 sm:col-span-2">
                <div className="relative">
                  <img
                    className={`h-16 w-16 rounded-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                    src={formData?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData?.name || 'User')}&background=random`}
                    alt="Profile"
                    onError={(e) => {
                      // Fallback to default avatar if image fails to load
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData?.name || 'User')}&background=random`;
                    }}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute -bottom-1 -right-1 p-1.5 rounded-full text-white ${
                      isUploading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    title={isUploading ? t('profile.settings.uploading', 'Uploading...') : t('profile.settings.changePicture', 'Change profile picture')}
                  >
                    <CameraIcon className="w-4 h-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  <p className="text-xs">{t('profile.settings.photoSize', 'PNG, JPG, GIF up to 5MB')}</p>
                </div>
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{t('profile.settings.fullName', 'Full name')}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder={t('profile.settings.enterFullName', 'Enter your full name')}
                />
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{t('profile.settings.email', 'Email address')}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{t('profile.settings.phone', 'Phone number')}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="tel"
                  name="phone"
                  value={formData?.phone || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder={t('profile.settings.enterPhone', 'Enter your phone number')}
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{t('profile.settings.password', 'Change Password')}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('profile.settings.passwordDescription', 'Update your password')}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{t('profile.settings.currentPassword', 'Current password')}</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder={t('profile.settings.enterCurrentPassword', 'Enter current password')}
                />
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{t('profile.settings.newPassword', 'New password')}</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder={t('profile.settings.enterNewPassword', 'Enter new password')}
                />
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{t('profile.settings.confirmPassword', 'Confirm new password')}</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder={t('profile.settings.confirmNewPassword', 'Confirm new password')}
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Password change success message */}
      {passwordSuccess && (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{passwordSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {/* Password change error message */}
      {passwordError && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{passwordError}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}
      >
        <div className="flex justify-between space-x-3">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('common.back', 'Back')}
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('common.saving', 'Saving...')}
                </>
              ) : (
                t('common.saveChanges', 'Save Profile')
              )}
            </button>

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isPasswordSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPasswordSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('common.saving', 'Saving...')}
                </>
              ) : (
                t('profile.settings.changePassword', 'Change Password')
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

SettingsTab.propTypes = {
  user: PropTypes.object.isRequired,
  isSaving: PropTypes.bool,
  onSave: PropTypes.func,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  onFileUpload: PropTypes.func,
};

SettingsTab.defaultProps = {
  isSaving: false,
  onSave: () => {},
  formData: {},
  setFormData: () => {},
  onFileUpload: () => Promise.resolve({}),
};

export default SettingsTab;