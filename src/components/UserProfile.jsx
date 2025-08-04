import { useAuth } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';
import { useTranslation } from 'react-i18next';

export default function UserProfile() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return user.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  if (loading) {
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
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl font-bold">
            {getInitials(user.user_metadata?.name)}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">
          {user.user_metadata?.name || t("profile.user")}
        </h2>
        <p className="text-gray-600">{user.email}</p>
        <div className="flex justify-center items-center mt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.user_metadata?.email_verified 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {user.user_metadata?.email_verified ? t("profile.verified") : t("profile.pending")}
          </span>
        </div>
      </div>

      {/* User Information Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Personal Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t("profile.personalInfo")}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("auth.fullName")}:</span>
              <span className="font-medium">{user.user_metadata?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("auth.email")}:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("auth.phone")}:</span>
              <span className="font-medium">{user.user_metadata?.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("profile.gender")}:</span>
              <span className="font-medium">
                {user.user_metadata?.gender ? t(`auth.${user.user_metadata.gender}`) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("profile.dateOfBirth")}:</span>
              <span className="font-medium">{formatDate(user.user_metadata?.dateOfBirth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("auth.address")}:</span>
              <span className="font-medium">{user.user_metadata?.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t("profile.accountStatus")}</h3>
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          {t("profile.editProfile")}
        </button>
        <LogoutButton className="flex-1" />
      </div>
    </div>
  );
}
