/* eslint-disable react/jsx-key */
import { Routes, Route } from "react-router-dom";
import { Sidenav, DashboardNavbar, Footer } from "../widgets/layout";
import { routes } from "../routes"; // Importing the modified routes function
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUserRole(decodedToken.role);
    }
  }, []);
  const filteredRoutes = routes(userRole);
  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav routes={filteredRoutes} /> {/* Pass the filtered routes */}
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Routes>
          {filteredRoutes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} key={path} /> // Adding a key prop
              )),
          )}
        </Routes>
        <div className="flex-grow h-full text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
