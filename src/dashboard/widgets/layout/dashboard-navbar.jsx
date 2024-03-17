import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "../../context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 text-black gap-1 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal transition-all opacity-50 hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="black">
            {page}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input
              placeholder="Search"
              color="lightBlue"
              size="regular"
              outline={false}
              iconRight
              icon={<BellIcon className="w-5 h-5" />}
            />
          </div>
          <div className="flex items-center space-x-4">
            {/* IconButton for mobile */}
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <Bars3Icon
                strokeWidth={3}
                className="w-6 h-6 text-blue-gray-500"
              />
            </IconButton>
            {/* Bell icon button */}
            <Menu>
              <MenuHandler>
                <IconButton variant="text" color="blue-gray">
                  <BellIcon className="w-5 h-5 text-black" />
                </IconButton>
              </MenuHandler>
              <MenuList className="border-0 w-max">
                <MenuItem className="flex items-center gap-3">
                  <Avatar
                    src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                    alt="item-1"
                    size="sm"
                    variant="circular"
                  />
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-normal"
                    >
                      <strong>New message</strong> from Laur
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-1 text-xs font-normal opacity-60"
                    >
                      <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                    </Typography>
                  </div>
                </MenuItem>
                <MenuItem className="flex items-center gap-4">
                  <Avatar
                    src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                    alt="item-1"
                    size="sm"
                    variant="circular"
                  />
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-normal"
                    >
                      <strong>New album</strong> by Travis Scott
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-1 text-xs font-normal opacity-60"
                    >
                      <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                    </Typography>
                  </div>
                </MenuItem>
                <MenuItem className="flex items-center gap-4">
                  <div className="grid rounded-full h-9 w-9 place-items-center bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                    <CreditCardIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-normal"
                    >
                      Payment successfully completed
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-1 text-xs font-normal opacity-60"
                    >
                      <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                    </Typography>
                  </div>
                </MenuItem>
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
