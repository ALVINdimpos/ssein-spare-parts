import { useState } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IconButton, Button, Typography } from "@material-tailwind/react";

export function Sidenav({ brandName, routes }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidenav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Icon */}
      <IconButton
        variant="text"
        color="white"
        size="sm"
        ripple={false}
        className={`fixed top-4 left-4 z-50 xl:hidden ${
          isOpen ? "hidden" : ""
        }`}
        onClick={toggleSidenav}
      >
        <XMarkIcon strokeWidth={2.5} className="w-5 h-5 text-white" />
      </IconButton>

      {/* Sidenav */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } xl:translate-x-0`}
      >
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
          <Link
            to="/"
            className="text-2xl font-bold text-black capitalize transition-colors hover:text-indigo-600"
            style={{ textTransform: "capitalize" }}
          >
            {brandName}
          </Link>

          {/* Close Icon */}
          <IconButton
            variant="filled"
            color="gray"
            size="sm"
            ripple={true}
            className={`xl:hidden ${isOpen ? "" : "hidden"}`}
            onClick={toggleSidenav}
          >
            <XMarkIcon strokeWidth={2} className="w-5 h-5" />
          </IconButton>
        </div>

        <nav className="mt-4">
          {routes.map(({ layout, title, pages }, key) => (
            <div key={key} className="border-t border-gray-200">
              {title && (
                <div className="px-8 py-4 text-sm font-semibold text-gray-600">
                  {title}
                </div>
              )}
              <ul>
                {pages.map(({ icon, name, path }) => (
                  <li key={name} className="relative">
                    <NavLink to={`/${layout}${path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "" : "text"}
                          color={isActive ? "black" : "blue-gray"}
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 xl:hidden"
          onClick={toggleSidenav}
        ></div>
      )}
    </>
  );
}

Sidenav.defaultProps = {
  brandName: "Ssein Spare Parts",
};

Sidenav.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
