import { RouterProvider } from "react-router-dom";
import router from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FavoriteProvider } from './contexts/FavoriteContext';
import React, { useState, useEffect } from "react";
import { supabase } from "./Lib/supabaseClient"; // أو حسب مسار ملف Supabase عندك


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <FavoriteProvider  user={user}>
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;
