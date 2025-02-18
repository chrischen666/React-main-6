import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import router from "./router";
import 'bootstrap/dist/css/bootstrap.css';
import { RouterProvider } from "react-router";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
