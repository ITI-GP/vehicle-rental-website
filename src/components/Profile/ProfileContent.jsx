// // External Dependencies
// import { lazy, Suspense, useState, useRef } from "react";
// import PropTypes from "prop-types";
// import { supabase } from "../../Lib/supabaseClient";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Components
// import ProfileHeader from "./ProfileHeader";

// // Lazy-loaded Tab Components
// const OverviewTab = lazy(() => import("./tabs/OverviewTab"));
// const RentedCarsTab = lazy(() => import("./tabs/RentedCarsTab"));
// const MyListingsTab = lazy(() => import("./tabs/MyListingsTab"));
// const FavoritesTab = lazy(() => import("./tabs/FavoritesTab"));
// const NotificationsTab = lazy(() => import("./tabs/NotificationsTab"));
// const SettingsTab = lazy(() => import("./tabs/SettingsTab"));

// /**
//  * LoadingSpinner Component
//  * Displays a loading spinner as a fallback for Suspense
//  */
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-64">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//   </div>
// );

// /**
//  * TabContent Component
//  * Renders the content for the active tab
//  */
// const TabContent = ({
//   tab,
//   user,
//   userRoles,
//   isSaving = false,
//   onSave = () => {},
//   formData = {},
//   setFormData = () => {},
//   onFileUpload = () => {},
// }) => {
//   // Render the appropriate tab component based on the active tab
//   const renderTabContent = () => {
//     switch (tab) {
//       case "overview":
//         return <OverviewTab user={user} userRoles={userRoles} />;
//       case "rented":
//         return <RentedCarsTab user={user} />;
//       case "listings":
//         return <MyListingsTab user={user} />;
//       case "favorites":
//         return <FavoritesTab user={user} />;
//       case "notifications":
//         return <NotificationsTab user={user} />;
//       case "settings":
//         return (
//           <SettingsTab
//             user={user}
//             isSaving={isSaving}
//             onSave={onSave}
//             formData={formData}
//             setFormData={setFormData}
//             onFileUpload={onFileUpload}
//           />
//         );
//       default:
//         return <OverviewTab user={user} userRoles={userRoles} />;
//     }
//   };

//   return (
//     <Suspense fallback={<LoadingSpinner />}>
//       <div className="w-full">{renderTabContent()}</div>
//     </Suspense>
//   );
// };

// TabContent.propTypes = {
//   tab: PropTypes.string.isRequired,
//   user: PropTypes.object.isRequired,
//   userRoles: PropTypes.shape({
//     isOwner: PropTypes.bool,
//     isRenter: PropTypes.bool,
//     isCompany: PropTypes.bool,
//   }),
//   isSaving: PropTypes.bool,
//   onSave: PropTypes.func,
//   formData: PropTypes.object,
//   setFormData: PropTypes.func,
// };

// /**
//  * ProfileContent Component
//  * Main container for the profile page content
//  */
// const ProfileContent = ({ activeTab, user, userRoles }) => {
//   // Initialize form data with user data
//   const [formData, setFormData] = useState({
//     name: user?.user_metadata?.name || '',
//     email: user?.email || '',
//     phone: user?.user_metadata?.phone || '',
//     address: user?.user_metadata?.address || '',
//     dateOfBirth: user?.user_metadata?.date_of_birth || '',
//     gender: user?.user_metadata?.gender || '',
//     avatar_url: user?.user_metadata?.avatar_url || ''
//   });
  
//   // Tab change is now handled by the parent ProfileLayout component
//   // via the activeTab prop
  
//   const [isSaving, setIsSaving] = useState(false);
//   const fileInputRef = useRef(null);
  
//   // Handle file upload
//   const handleFileUpload = async (file) => {
//     if (!file) {
//       toast.error('Please select a file to upload');
//       return { error: 'No file selected' };
//     }
    
//     // Check file size (max 5MB)
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (file.size > maxSize) {
//       const errorMsg = `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the 5MB limit`;
//       toast.error(errorMsg);
//       return { error: errorMsg };
//     }
    
//     // Check file type
//     const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (!validTypes.includes(file.type)) {
//       const errorMsg = `Unsupported file type. Please upload a JPEG, PNG, or GIF image.`;
//       toast.error(errorMsg);
//       return { error: errorMsg };
//     }
    
//     // Show upload in progress
//     const toastId = toast.loading('Uploading image...');
    
//     try {
//       // Generate a unique file name with user ID as folder
//       const fileExt = file.name.split('.').pop().toLowerCase();
//       const fileName = `${Date.now()}.${fileExt}`;
//       const filePath = `${user.id}/${fileName}`;  // Store in user's folder
      
//       // First, try to delete any existing avatar for this user
//       try {
//         toast.update(toastId, { render: 'Cleaning up previous avatar...', type: 'info', isLoading: true });
        
//         const { data: list, error: listError } = await supabase.storage
//           .from('avatars')
//           .list(user.id);
        
//         if (!listError && list && list.length > 0) {
//           const filesToRemove = list.map(file => `${user.id}/${file.name}`);
//           const { error: removeError } = await supabase.storage
//             .from('avatars')
//             .remove(filesToRemove);
          
//           if (removeError) {
//             console.warn('Warning: Could not remove existing avatar:', removeError);
//             // Continue with upload even if delete fails
//           }
//         }
//       } catch (cleanupError) {
//         console.warn('Warning during avatar cleanup:', cleanupError);
//         // Continue with upload even if cleanup fails
//       }
      
//       // Upload the new file
//       toast.update(toastId, { render: 'Uploading new avatar...', type: 'info', isLoading: true });
      
//       const { error: uploadError } = await supabase.storage
//         .from('avatars')
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: true,
//           contentType: file.type
//         });
      
//       if (uploadError) {
//         console.error('Upload error:', uploadError);
//         toast.update(toastId, { 
//           render: 'Failed to upload image. Please try again.', 
//           type: 'error', 
//           isLoading: false,
//           autoClose: 3000
//         });
//         return { error: uploadError.message };
//       }
      
//       // Get the public URL with a cache buster
//       const cacheBuster = `?v=${Date.now()}`;
//       const { data: { publicUrl } } = supabase.storage
//         .from('avatars')
//         .getPublicUrl(filePath);
      
//       // Add cache buster to force refresh
//       const publicUrlWithCache = `${publicUrl}${cacheBuster}`;
      
//       // Update the form data with the new avatar URL
//       setFormData(prev => ({
//         ...prev,
//         avatar_url: publicUrlWithCache
//       }));
      
//       // Also update the user's metadata with the new avatar URL
//       toast.update(toastId, { render: 'Updating profile...', type: 'info', isLoading: true });
      
//       const { error: updateError } = await supabase.auth.updateUser({
//         data: { 
//           ...user.user_metadata,
//           avatar_url: publicUrlWithCache,
//           updated_at: new Date().toISOString()
//         }
//       });
      
//       if (updateError) {
//         console.error('Error updating user metadata:', updateError);
//         toast.update(toastId, { 
//           render: 'Uploaded but failed to update profile. Please try again.', 
//           type: 'error', 
//           isLoading: false,
//           autoClose: 3000
//         });
//         return { error: updateError.message };
//       }
      
//       // Success! Update the toast
//       toast.update(toastId, { 
//         render: 'Profile picture updated successfully!', 
//         type: 'success', 
//         isLoading: false,
//         autoClose: 3000
//       });
      
//       return { publicUrl: publicUrlWithCache };
//     } catch (error) {
//       console.error('Error in handleFileUpload:', error);
//       toast.update(toastId, { 
//         render: error.message || 'Failed to upload file. Please try again.', 
//         type: 'error', 
//         isLoading: false,
//         autoClose: 3000
//       });
//       return { error: error.message || 'Failed to upload file' };
//     } finally {
//       // Dismiss any remaining loading toasts
//       setTimeout(() => {
//         toast.dismiss(toastId);
//       }, 100);
//     }
//   };

//   const handleSave = async (updatedData) => {
//     if (isSaving) return;
    
//     setIsSaving(true);
    
//     try {
   
//       // Only include allowed fields in the update
//       const allowedFields = [
//         'name', 'phone', 'address', 'dateOfBirth', 'gender', 'avatar_url'
//       ];
      
//       // Get current user data
//       const { data: { user: currentUser }, error: fetchError } = await supabase.auth.getUser();
      
//       if (fetchError) throw fetchError;
      
//       const currentMetadata = currentUser?.user_metadata || {};

      
//       // Prepare the update payload with only allowed and changed fields
//       const updatePayload = {};
      
//       // Check each field that should be updated
//       allowedFields.forEach(field => {
//         if (updatedData[field] !== undefined && updatedData[field] !== currentMetadata[field]) {
//           updatePayload[field] = updatedData[field];
//         }
//       });
   
      
//       // If nothing to update, return early
//       if (Object.keys(updatePayload).length === 0) {
   
//         toast.info('No changes to save');
//         return { success: true };
//       }
      
//       // Add timestamp
//       updatePayload.updated_at = new Date().toISOString();
      
//       // Prepare the complete update object
//       const completeUpdate = {
//         ...currentMetadata,
//         ...updatePayload
//       };
    
      
//       // Update user metadata in Supabase

//       const { data, error } = await supabase.auth.updateUser({
//         data: completeUpdate
//       });
      
//       if (error) {
//         console.error('Supabase update error:', error);
//         throw error;
//       }
      

      
//       // Update local form data
//       setFormData(prev => ({
//         ...prev,
//         ...updatePayload
//       }));
      
//       // Force a refresh of the user data

//       const { data: { user: refreshedUser } } = await supabase.auth.getUser();

      
//       // Show success message
//       toast.success('Profile updated successfully!');
      
//       return { success: true };
//     } catch (error) {
//       console.error('Error in handleSave:', {
//         message: error.message,
//         details: error,
//         stack: error.stack
//       });
//       toast.error(`Failed to update profile: ${error.message}`);
//       return { error: error.message };
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Render the tab content
//   const renderTabContent = (tab) => {
//     switch (tab) {
//       case 'overview':
//         return <OverviewTab user={user} userRoles={userRoles} />;
//       case 'rented':
//         return <RentedCarsTab user={user} />;
//       case 'listings':
//         return <MyListingsTab user={user} />;
//       case 'favorites':
//         return <FavoritesTab user={user} />;
//       case 'notifications':
//         return <NotificationsTab user={user} />;
//       case 'settings':
//         return (
//           <SettingsTab
//             user={user}
//             isSaving={isSaving}
//             onSave={handleSave}
//             formData={formData}
//             setFormData={setFormData}
//             onFileUpload={handleFileUpload}
//           />
//         );
//       default:
//         return <OverviewTab user={user} userRoles={userRoles} />;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Suspense fallback={<LoadingSpinner />}>
//         {renderTabContent(activeTab)}
//       </Suspense>
//     </div>
//   );
// };

// ProfileContent.propTypes = {
//   activeTab: PropTypes.string.isRequired,
//   user: PropTypes.object.isRequired,
//   userRoles: PropTypes.shape({
//     isOwner: PropTypes.bool,
//     isRenter: PropTypes.bool,
//     isCompany: PropTypes.bool,
//   }),
// };

// export default ProfileContent;
// External Dependencies
import { lazy, Suspense, useState, useRef } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../Lib/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import ProfileHeader from "./ProfileHeader";

// Lazy-loaded Tab Components
const OverviewTab = lazy(() => import("./tabs/OverviewTab"));
const RentedCarsTab = lazy(() => import("./tabs/RentedCarsTab"));
const MyListingsTab = lazy(() => import("./tabs/MyListingsTab"));
const FavoritesTab = lazy(() => import("./tabs/FavoritesTab"));
const NotificationsTab = lazy(() => import("./tabs/NotificationsTab"));
const SettingsTab = lazy(() => import("./tabs/SettingsTab"));

/**
 * LoadingSpinner Component
 * Displays a loading spinner as a fallback for Suspense
 */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

/**
 * ProfileContent Component
 * Main container for the profile page content
 */
const ProfileContent = ({ activeTab, user, userRoles }) => {
  // Initialize form data with user data
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    address: user?.user_metadata?.address || "",
    dateOfBirth: user?.user_metadata?.date_of_birth || "",
    gender: user?.user_metadata?.gender || "",
    avatar_url: user?.user_metadata?.avatar_url || "",
  });

  // Tab change is now handled by the parent ProfileLayout component
  // via the activeTab prop

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return { error: "No file selected" };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const errorMsg = `File size (${(file.size / (1024 * 1024)).toFixed(
        2
      )}MB) exceeds the 5MB limit`;
      toast.error(errorMsg);
      return { error: errorMsg };
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      const errorMsg = 'Unsupported file type. Please upload a JPEG, PNG, or GIF image.';
      toast.error(errorMsg);
      return { error: errorMsg };
    }

    // Show upload in progress
    const toastId = toast.loading("Uploading image...");

    try {
      // Generate a unique file name with user ID as folder
      const fileExt = file.name.split(".").pop().toLowerCase();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`; // Store in user's folder

      // First, try to delete any existing avatar for this user
      try {
        toast.update(toastId, {
          render: "Cleaning up previous avatar...",
          type: "info",
          isLoading: true,
        });

        const { data: list, error: listError } = await supabase.storage
          .from("avatars")
          .list(user.id);

        if (!listError && list && list.length > 0) {
          const filesToRemove = list.map((file) => `${user.id}/${file.name}`);
          const { error: removeError } = await supabase.storage
            .from("avatars")
            .remove(filesToRemove);

          if (removeError) {
            console.warn(
              "Warning: Could not remove existing avatar:",
              removeError
            );
            // Continue with upload even if delete fails
          }
        }
      } catch (cleanupError) {
        console.warn("Warning during avatar cleanup:", cleanupError);
        // Continue with upload even if cleanup fails
      }

      // Upload the new file
      toast.update(toastId, {
        render: "Uploading new avatar...",
        type: "info",
        isLoading: true,
      });

      // Remove upsert: true (Supabase Storage does not support upsert)
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.update(toastId, {
          render: "Failed to upload image. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return { error: uploadError.message };
      }

      // Get the public URL with a cache buster
      const cacheBuster = `?v=${Date.now()}`;
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Add cache buster to force refresh
      const publicUrlWithCache = `${publicUrl}${cacheBuster}`;

      // Update the form data with the new avatar URL
      setFormData((prev) => ({
        ...prev,
        avatar_url: publicUrlWithCache,
      }));

      // Also update the user's metadata with the new avatar URL
      toast.update(toastId, {
        render: "Updating profile...",
        type: "info",
        isLoading: true,
      });

      // First update the auth user metadata
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: publicUrlWithCache,
          updated_at: new Date().toISOString(),
        },
      });

      if (updateAuthError) {
        console.error("Error updating user metadata:", updateAuthError);
        toast.update(toastId, {
          render: "Uploaded but failed to update profile. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return { error: updateAuthError.message };
      }

      // Then update the users table using a stored procedure or RLS-friendly update
      try {
        const { error: updateUserError } = await supabase
          .from("users")
          .update({
            avatar_url: publicUrlWithCache,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (updateUserError) {
          console.warn(
            "Warning: Could not update users table:",
            updateUserError
          );
          // Continue even if users table update fails
        }
      } catch (usersTableError) {
        console.warn("Warning during users table update:", usersTableError);
        // Continue even if users table update fails
      }

      // Success! Update the toast
      toast.update(toastId, {
        render: "Profile picture updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return { publicUrl: publicUrlWithCache };
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
      toast.update(toastId, {
        render: error.message || "Failed to upload file. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return { error: error.message || "Failed to upload file" };
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 100);
    }
  };

  // Handle profile save
  const handleSave = async (updatedData) => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      // Only include allowed fields in the update
      const allowedFields = [
        "name",
        "phone",
        "address",
        "dateOfBirth",
        "gender",
        "avatar_url",
      ];

      // Get current user data
      const {
        data: { user: currentUser },
        error: fetchError,
      } = await supabase.auth.getUser();

      if (fetchError) throw fetchError;

      const currentMetadata = currentUser?.user_metadata || {};

      // Prepare the update payload with only allowed and changed fields
      const updatePayload = {};

      // Check each field that should be updated
      allowedFields.forEach((field) => {
        if (
          updatedData[field] !== undefined &&
          updatedData[field] !== currentMetadata[field]
        ) {
          updatePayload[field] = updatedData[field];
        }
      });

      // If nothing to update, return early
      if (Object.keys(updatePayload).length === 0) {
        toast.info("No changes to save");
        return { success: true };
      }

      // Add timestamp
      updatePayload.updated_at = new Date().toISOString();

      // Prepare the complete update object
      const completeUpdate = {
        ...currentMetadata,
        ...updatePayload,
      };

      // Update user metadata in Supabase

      const { data, error } = await supabase.auth.updateUser({
        data: completeUpdate,
      });

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      // Update local form data
      setFormData((prev) => ({
        ...prev,
        ...updatePayload,
      }));

      // Force a refresh of the user data

      const {
        data: { user: refreshedUser },
      } = await supabase.auth.getUser();

      // Show success message
      toast.success("Profile updated successfully!");

      return { success: true };
    } catch (error) {
      console.error("Error in handleSave:", {
        message: error.message,
        details: error,
        stack: error.stack,
      });
      toast.error(`Failed to update profile: ${error.message}`);
      return { error: error.message };
    } finally {
      setIsSaving(false);
    }
  };

  // Render tab content based on activeTab
  const renderTabContent = (tab) => {
    switch (tab) {
      case "overview":
        return <OverviewTab user={user} userRoles={userRoles} />;
      case "rented":
        return <RentedCarsTab user={user} />;
      case "listings":
        return <MyListingsTab user={user} />;
      case "favorites":
        return <FavoritesTab user={user} />;
      case "notifications":
        return <NotificationsTab user={user} />;
      case "settings":
        return (
          <SettingsTab
            user={user}
            isSaving={isSaving}
            onSave={handleSave}
            formData={formData}
            setFormData={setFormData}
            onFileUpload={handleFileUpload}
          />
        );
      default:
        return <OverviewTab user={user} userRoles={userRoles} />;
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="space-y-6">
        {renderTabContent(activeTab)}
      </div>
    </Suspense>
  );
};

ProfileContent.propTypes = {
  activeTab: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  userRoles: PropTypes.shape({
    isOwner: PropTypes.bool,
    isRenter: PropTypes.bool,
    isCompany: PropTypes.bool,
  }),
};

export default ProfileContent;
