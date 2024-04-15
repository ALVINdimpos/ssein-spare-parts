import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "../../context";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUserData(decodedToken);
    }
  }, []);

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-black-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent text-black gap-1 p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="black"
                className="font-normal transition-all opacity-50 hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography variant="small" color="black" className="font-normal">
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="black">
            {page}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* IconButton for mobile */}
            <IconButton
              variant="text"
              color="black"
              className="grid xl:hidden"
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <Bars3Icon strokeWidth={3} className="w-6 h-6 text-black" />
            </IconButton>

            {/* Display user data */}
            {userData && (
              <Menu>
                <MenuHandler>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <img
                      src="https://www.w3schools.com/howto/img_avatar.png"
                      className="w-10 h-10 rounded-full"
                      alt="user-avatar"
                    />
                    <Typography variant="body" color="black">
                      {userData.user_name}
                    </Typography>
                  </div>
                </MenuHandler>
                <MenuList>
                  <MenuItem>
                    <div className="flex flex-col">
                      <span className="font-semibold text-black">
                        {userData.user_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {userData.email}
                      </span>
                      <span className="text-sm text-gray-500">
                        Role: {userData.role}
                      </span>
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      localStorage.removeItem("accessToken");
                      setUserData(null);
                      window.location.href = "/login";
                    }}
                  >
                    Sign out
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
