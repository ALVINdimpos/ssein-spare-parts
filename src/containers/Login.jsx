import { useState } from "react";
import axios from "axios";
import Loader from "react-js-loader";
import { jwtDecode } from "jwt-decode";
const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      const response = await axios.post(
        "https://parts.husseinking.com/users/login",
        `grant_type=&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      const { access_token } = response.data;
      const decodedToken = jwtDecode(access_token);
      if (decodedToken.role == "client") {
        window.location.href = "/dashboard/products";
      } else {
        window.location.href = "/dashboard/home";
      }
      // Store the access token in local storage
      localStorage.setItem("accessToken", access_token);
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };
  return (
    <div>
      <div className="absolute top-0 bottom-0 left-0 w-full h-full overflow-hidden leading-5 bg-black-900 bg-gradient-to-b from-gray-900 via-gray-900 to-black-800"></div>
      <div className="relative flex items-center justify-center min-h-screen bg-transparent shadow-xl sm:flex sm:flex-row rounded-3xl">
        <div className="z-10 flex flex-col self-center lg:px-14 sm:max-w-4xl xl:max-w-md">
          <div className="flex-col self-start hidden text-gray-300 lg:flex">
            <h1 className="my-3 text-4xl font-semibold">Welcome back!</h1>
            <p className="pr-3 text-sm opacity-75">
              Log in to access your account.
            </p>
          </div>
        </div>
        <div className="z-10 flex self-center justify-center">
          <div className="p-12 mx-auto bg-white rounded-3xl w-96">
            <div className="mb-7">
              <h3 className="text-2xl font-semibold text-gray-800">Sign In </h3>
            </div>
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gb focus:bg-gray-100 focus:outline-none focus:border-gray-300"
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                  />
                </div>
                <div className="relative">
                  <input
                    placeholder="Password"
                    type={showPassword ? "password" : "text"}
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 text-sm bg-gray-200 border border-gray-200 rounded-lg 0 focus:bg-gray-100 focus:outline-none focus:border-gray-300"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 text-sm leading-5">
                    <svg
                      onClick={() => setShowPassword(!showPassword)}
                      className={`h-4 text-black ${showPassword ? "block" : "hidden"}`}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="currentColor"
                        d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                      ></path>
                    </svg>
                    <svg
                      onClick={() => setShowPassword(!showPassword)}
                      className={`h-4 text-black ${showPassword ? "hidden" : "block"}`}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                    >
                      <path
                        fill="currentColor"
                        d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="ml-auto text-sm">
                    <a href="#" className="text-green hover:text-gray-600">
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div>
                  {errorMessage && (
                    <div
                      className="px-4 py-3 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500"
                      role="alert"
                    >
                      <p className="font-bold">{errorMessage}</p>
                    </div>
                  )}
                  <div>
                    <button
                      type="submit"
                      className="relative flex justify-center w-full p-3 font-semibold tracking-wide text-gray-100 transition duration-500 ease-in bg-purple-800 rounded-lg cursor-pointer hover:bg-purple-700"
                      disabled={loading}
                    >
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center ">
                          <Loader
                            type="spinner-default"
                            bgColor={"#fff"}
                            size={30}
                          />
                        </div>
                      )}
                      {!loading && "Sign In"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <svg
        className="absolute bottom-0 left-0 "
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default Login;
