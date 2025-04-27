import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import {Routes, Route } from 'react-router-dom';
import Site from './components/manager/Site';
import SiteClient from './components/client/SiteClient';
import SettingsClient from './components/client/Setting';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/manager/:id" element={<Site />} />
        <Route path="/manager/:id/AddClient" element={<Site />} />
        <Route path="/manager/:id/EditClient" element={<Site />} />
        <Route path="/manager/:id/Details/:id" element={<Site />} />
        <Route path="/manager/:id/settings" element={<Site />} />

        <Route path="/client/:id" element={<SiteClient />} />
        <Route path="/client/:id/settings" element={<SettingsClient />} />

      </Routes>
    </>
  );
}

export default App;
