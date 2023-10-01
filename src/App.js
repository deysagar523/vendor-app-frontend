import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
} from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import CreateVendor from "./Components/CreateVendor";
import VendorList from "./Components/VendorList";

function App() {
  const location = useLocation();
  const [selectedNavItem, setSelectedNavItem] = useState("/");

  useEffect(() => {
    setSelectedNavItem(location.pathname);
  }, [location]);

  const navItemStyle = {
    fontWeight: "bold",
    backgroundColor: "black",
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vendor App
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            style={selectedNavItem === "/" ? navItemStyle : {}}
          >
            Create Vendor
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/vendor-list"
            style={selectedNavItem === "/vendor-list" ? navItemStyle : {}}
          >
            Vendor List
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<CreateVendor />} />
          <Route path="/vendor-list" element={<VendorList />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
