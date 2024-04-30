import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Welcome from "./components/Welcome";
import Selection from "./components/Selection";

import { ItemStateProvider } from "./providers/ItemStateProvider";

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate replace to="/" />} />
        <Route path="/" element={
          <ItemStateProvider>
            <Layout children={<Welcome />} />
          </ItemStateProvider>
        } />
        <Route path="/cashier/:id/" element={
          <ItemStateProvider>
            <Layout children={<Selection />} />
          </ItemStateProvider>
        } />
      </Routes>
    </Router>
  );
}

export default App;