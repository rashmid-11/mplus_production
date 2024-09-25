import { Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { navbar, navbarContainer, navbarRow, navbarIconButton, navbarDesktopMenu, navbarMobileMenu } from "examples/Navbars/DashboardNavbar/styles";
import { useArgonController, setTransparentNavbar, setMiniSidenav, setOpenConfigurator } from "context";
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import axios from "axios";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem image={<img src={team2} alt="person" />} title={["New message", "from Laur"]} date="13 minutes ago" onClick={handleCloseMenu} />
      <NotificationItem image={<img src={logoSpotify} alt="person" />} title={["New album", "by Travis Scott"]} date="1 day" onClick={handleCloseMenu} />
      <NotificationItem color="secondary" image={<Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>payment</Icon>} title={["", "Payment successfully completed"]} date="2 days" onClick={handleCloseMenu} />
    </Menu>
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);
  const handleDropdownClose = () => setDropdownOpen(false);

  const [profileData] = useState({
    firstname: sessionStorage.getItem('UserName'),
  });

  const handleLogout = async () => {
    const imei = sessionStorage.getItem('IMEI');
    const emailID = sessionStorage.getItem('Email');
    const password = sessionStorage.getItem('Password');
    const token = sessionStorage.getItem('Token');

    try {
      await axios.post(`https://testingNewAPI.mplusparking.com/AppServerCall/logoutCustomer`, {
        imei,
        emailID,
        password,
        token
      });

      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      //console.error('Error during logout:', error);
    }
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme, { navbarType })}>
        <ArgonBox
          color={light && transparentNavbar ? "white" : "dark"}
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <Icon fontSize="medium" sx={navbarDesktopMenu} onClick={handleMiniSidenav} style={{ marginRight: '50px' }}>
            {miniSidenav ? "menu_open" : "menu"}
          </Icon>
          <Breadcrumbs
            icon="home"
            title={route[route.length - 1]}
            route={route}
            light={transparentNavbar ? light : false}
          />
        </ArgonBox>
        {isMini ? null : (
          <ArgonBox sx={(theme) => navbarRow(theme, { isMini })}>
            <Link to="#" style={{ marginRight: '10px' }}>
              <IconButton sx={navbarIconButton} size="small" onClick={handleDropdownToggle}>
                <IoPersonCircle style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }} />
                <div style={{ fontSize: '15px', color: 'white', marginLeft: '5px' }}><strong>Welcome</strong></div>
                <div style={{ fontSize: '15px', color: 'white', marginLeft: '5px' }}><strong>{profileData.firstname}</strong></div>
              </IconButton>
              <Dropdown show={dropdownOpen} onClose={handleDropdownClose}>
                <Dropdown.Menu style={{ fontSize: '15px', color: 'white' }}>
                  <Link to="/profile">
                    <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
                  </Link>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Link>
            <IconButton size="small" color={light && transparentNavbar ? "white" : "dark"} sx={navbarMobileMenu} onClick={handleMiniSidenav}>
              <Icon>{miniSidenav ? "menu_open" : "menu"}</Icon>
            </IconButton>
            {renderMenu()}
          </ArgonBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: true,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
