import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import "./index.css";
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
