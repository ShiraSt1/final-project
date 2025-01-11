import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { Router, Routes,Route } from 'react-router-dom';
import Organizers from './components/Organizers';
import Receiver from './components/Receiver';

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/organizer/:userId" element={<Organizers/>} />
          <Route path="/receiver/:userId" element={<Receiver/>} />
        </Routes>
      {/* <div className="App">
        <Login />
      </div> */}
    </>
  );
}

export default App;
