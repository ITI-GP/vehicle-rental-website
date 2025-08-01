import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
import "./i18n";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";

import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </LanguageProvider>
  </StrictMode>
);
