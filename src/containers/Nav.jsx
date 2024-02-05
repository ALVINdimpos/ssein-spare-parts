import "./Nav.css"; // Make sure to adjust the import path if necessary

const Header = () => {
  return (
    <>
      <header className="bg-white shadow-lg h-24 md:flex md:justify-between md:items-center sticky top-0 z-50">
        <div className="flex-shrink-0 flex items-center justify-center px-4 lg:px-6 xl:px-8">
          <a href="/">
            <img
              className="h-12 md:h-16"
              src="https://i.ibb.co/W6ZXdqN/2021-10-26-16h20-21.png"
              alt=""
            />
          </a>
        </div>
        <nav className="header-links contents font-semibold text-base md:flex md:items-center md:space-x-4 lg:text-lg">
          <ul className="flex items-center ml-4 xl:ml-8 mr-auto md:ml-0">
            <li className="p-3 xl:p-6 active">
              <a href="/">
                <span>Home</span>
              </a>
            </li>
            <li className="p-3 xl:p-6">
              <a href="/">
                <span>Used Parts</span>
              </a>
            </li>
            <li className="p-3 xl:p-6">
              <a href="/">
                <span>New Parts</span>
              </a>
            </li>
            <li className="p-3 xl:p-6">
              <a href="/">
                <span>Tyres and Mag</span>
              </a>
            </li>
            <li className="p-3 xl:p-6">
              <a href="/">
                <span>services</span>
              </a>
            </li>
            <li className="p-3 xl:p-6">
              <a href="/">
                <span>Contact</span>
              </a>
            </li>
          </ul>
          <div className="flex items-center px-4 lg:px-6 xl:px-8 mt-4 md:mt-0">
            <button className="bg-red-500 hover:bg-gray-700 text-white font-bold px-4 xl:px-6 py-2 xl:py-3 rounded">
              login
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
