import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';

export default function FavoritesTab({ user }) {
  const navigate = useNavigate();
  
  const handleBrowseVehicles = () => {
    navigate('/vehicles');
  };
  const { t } = useTranslation();
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {t('profile.favorites.title', 'Your Favorites')}
      </h2>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('profile.favorites.noFavorites', 'No favorites yet')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('profile.favorites.getStarted', 'Save your favorite vehicles while browsing.')}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleBrowseVehicles}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('profile.favorites.browseVehicles', 'Browse Vehicles')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
