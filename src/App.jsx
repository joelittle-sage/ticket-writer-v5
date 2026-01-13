import { Routes, Route } from "react-router-dom";
import TicketGenerator from "./components/TicketGenerator";
import Admin from "./components/Admin";
import logo from "./assets/Sage_Logo_Brilliant_Green_RGB.svg";

function Layout({ children }) {
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px 0 20px",
        }}
      >
        <img src={logo} alt="Sage" style={{ height: "40px" }} />
      </header>

      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <TicketGenerator />
          </Layout>
        }
      />

      <Route
        path="/admin"
        element={
          <Layout>
            <Admin />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
