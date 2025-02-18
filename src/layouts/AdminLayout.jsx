import { NavLink, Outlet } from "react-router";
const routes = [
  { path: "/", name: "首頁" },
  { path: "/admin", name: "後台產品管理" },
];
export default function AdminLayout() {
  return (
    <>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5">
            {routes.map((route) => {
              return (
                <li className="nav-item" key={route.path}>
                  <NavLink className="nav-link" to={route.path}>
                    {route.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
