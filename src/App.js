import { useEffect ,useState,useMemo} from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import ArgonBox from "components/ArgonBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Dashboard from "layouts/dashboard";
import routes from "routes";
import { useArgonController, setMiniSidenav, setOpenConfigurator } from "context";
import brand from "assets/images/mplusbg.png";
import brandDark from "assets/images/mplusbg.png";
import "assets/css/nucleo-icons.css";
import "assets/css/nucleo-svg.css";
import Login from "layouts/login/Login";
import SignUpnew from "layouts/login/signupnew"; // Correct import name
import "layouts/login/Login.css"; // Ensure this CSS is imported

export default function App() {
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor, darkSidenav, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true');

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enters mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leaves mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const isLoginPage = pathname.toLowerCase() === "/login";
  const isForgotPassword = pathname.toLowerCase() === "/login/forgotpassword";
  const isProfilePage = pathname.toLowerCase() === "/login/profile";
  const isResetPasswordPage = pathname.toLowerCase() === "/login/forgotpassword/enterotp/resetpassword";
  const isNotFoundPage = pathname.toLowerCase() === "/notfoundpage";
  const isEnterotp = pathname.toLowerCase() === "/login/forgotpassword/enterotp";

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={
              <div>
                {!isLoginPage && !isForgotPassword && !isNotFoundPage && !isResetPasswordPage && !isEnterotp && (
                  <Sidenav
                    color={sidenavColor}
                    brand={darkSidenav || darkMode ? brand : brandDark}
                    brandName="M PLUS PARKING"
                    routes={routes}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                  />
                )}
                {route.component}
              </div>
            }
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = (
    <ArgonBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </ArgonBox>
  );

  let allRoutes = getRoutes(routes);

  return (
    <ThemeProvider theme={direction === "rtl" ? (darkMode ? themeDarkRTL : themeRTL) : (darkMode ? themeDark : theme)}>
      <CssBaseline />
      {layout === "Dashboard" && (
        <>
          {!isLoginPage && layout === "Dashboard" ? null : <Configurator />}
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}

      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/newsignup" element={<SignUpnew />} />
        {isLoggedIn ? (
          <>
            {allRoutes}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect any undefined routes to login */}
        </>
          
        )}
      </Routes>
    </ThemeProvider>
  );
}
