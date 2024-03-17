import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { getNetworkStatus, notification } from "./utils";
import { Dashboard } from "./dashboard/layouts";
import { publicRoutes } from "./routes";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

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
      <ScrollToTop />
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
