import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Clients from "./pages/Clients/Clients";
import SelectedClients from "./pages/SelectedClients/SelectedClients";

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem("userName");
  });

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userName");
    }
  }, [userName]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !userName ? (
              <Home setUserName={setUserName} />
            ) : (
              <Navigate to="/clients" replace />
            )
          }
        />
        <Route
          path="/clients"
          element={
            userName ? (
              <Clients userName={userName} setUserName={setUserName} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/clients-selected"
          element={
            userName ? (
              <SelectedClients userName={userName} setUserName={setUserName} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
