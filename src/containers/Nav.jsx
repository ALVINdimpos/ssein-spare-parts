import { Link } from "react-router-dom";
import "./Nav.css"; // Make sure to adjust the import path if necessary

const Header = () => {
  return (
    <>
      <header className="sticky top-0 z-50 h-24 bg-white shadow-lg md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-center flex-shrink-0 px-4 lg:px-6 xl:px-8">
          {/* <a href="/">
            <img
              className="h-12 md:h-16"
              src="https://i.ibb.co/W6ZXdqN/2021-10-26-16h20-21.png"
              alt=""
            />
          </a> */}
        </div>
        <nav className="text-base font-semibold header-links contents md:flex md:items-center md:space-x-4 lg:text-lg">
          <ul className="flex items-center ml-4 mr-auto xl:ml-8 md:ml-0">
            <li className="p-3 xl:p-6 active">
              <Link to="/">
                <span>Home</span>
              </Link>
            </li>
            <li className="p-3 xl:p-6">
              <Link to="/Used-parts">
                <span>Used Parts</span>
              </Link>
            </li>
            <li className="p-3 xl:p-6">
              <Link to="/New-parts">
                <span>New Parts</span>
              </Link>
            </li>
            <Link className="p-3 xl:p-6">
              <a to="/Body-parts">
                <span>Body parts</span>
              </a>
            </Link>
            {/* <li className="p-3 xl:p-6">
              <a href="/">
                <span>services</span>
              </a>
            </li> */}
            <li className="p-3 xl:p-6">
              <Link to="/Contact-us">
                <span>Contact</span>
              </Link>
            </li>
          </ul>
          <div className="flex items-center px-4 mt-4 lg:px-6 xl:px-8 md:mt-0">
            <Link
              to="/login"
              className="px-4 py-2 font-bold text-white rounded bg-primary xl:px-6 xl:py-3"
            >
              login
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
