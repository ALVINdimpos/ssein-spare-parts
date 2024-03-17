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
import { BellIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "../../context";
import { useState } from "react";
export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);

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
            {/* Bell icon button */}
            <BellIcon
              className="w-6 h-6 text-black cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {/* Notification dropdown */}
            {showNotifications && (
              <Menu>
                <MenuList>
                  <MenuItem>No new notifications</MenuItem>
                </MenuList>
              </Menu>
            )}
            {/* Avatar for user icon */}
            <Menu>
              <MenuHandler>
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <div className="flex flex-col">
                    <span className="font-semibold text-black">Neil Sims</span>
                  </div>
                </MenuItem>
                <MenuItem>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
