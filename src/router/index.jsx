import { createHashRouter } from "react-router";
import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import ProductPage from "../pages/ProductPage";
import FrontLayout from "../layouts/FrontLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProductDetailPage from "../pages/ProductDetailPage";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/LoginPage";

const router = createHashRouter([
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <ProductList />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
