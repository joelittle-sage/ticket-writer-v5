import { Routes, Route } from "react-router-dom";
import TicketGenerator from "./components/TicketGenerator";
import Admin from "./components/Admin";
import logo from "./assets/Sage_Logo_Brilliant_Green_RGB.svg";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {/* Header */}
            <header
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px 0 20px",
              }}
            >
              <img
                src={logo}
                alt="Sage"
                style={{
                  height: "40px",
                  width: "auto",
                }}
              />
            </header>

            {/* Main content */}
            <main>
              <TicketGenerator />
            </main>
          </>
        }
      />

      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
