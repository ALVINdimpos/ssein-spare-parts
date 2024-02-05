import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { getNetworkStatus, notification } from "./utils";

import { publicRoutes } from "./routes";

const App = () => {
  const [isOnline, setIsOnline] = useState(getNetworkStatus());
  const [isReloaded, setIsReloaded] = useState(true);

  useEffect(() => {
    const handleNetworkChange = () => {
      setIsOnline(getNetworkStatus());
    };

    window.addEventListener("offline", handleNetworkChange);
    window.addEventListener("online", handleNetworkChange);

    return () => {
      window.removeEventListener("offline", handleNetworkChange);
      window.removeEventListener("online", handleNetworkChange);
    };
  }, []);

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (!isReloaded && !isOnline) {
      notification(
        "You are offline, some content won't be visible",
        "info",
        "bottomLeft",
      );
    }
    setIsReloaded(false);
  }, [isReloaded, isOnline]);

  return (
    <Router>
      <Routes>
        {publicRoutes.map((route) => {
          return (
            <Route key={route.path} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </Router>
  );
};

export default App;
