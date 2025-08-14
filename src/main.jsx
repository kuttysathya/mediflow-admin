import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import DoctorContextProvider from "./Context/DoctorContext.jsx";
import AdminContextProvider from "./Context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
          <App />
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
