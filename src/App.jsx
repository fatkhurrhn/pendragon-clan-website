// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import BaseHome from './pages/BaseHome';
import UploadBase from './pages/UploadBase';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import ClanHome from './pages/ClanHome';
import ClanListMembers from './pages/ClanListMembers';
import ClanWarLog from './pages/ClanWarLog';
import ClanCurrentWar from './pages/ClanCurrentWar';
import ClanCapitalRaids from './pages/ClanCapitalRaids';
import ClanWarLegues from './pages/ClanWarLegues';
import PlayerDetail from './pages/PlayerDetail';
import ClanSearch from './pages/ClanSearch';
import ClanDetail from './pages/ClanDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/clan" element={<ClanHome />} /> 
          <Route path="/members" element={<ClanListMembers />} /> 
          <Route path="/warlog" element={<ClanWarLog />} /> 
          <Route path="/currentwar" element={<ClanCurrentWar />} /> 
          <Route path="/capital" element={<ClanCapitalRaids />} /> 
          <Route path="/warleagues" element={<ClanWarLegues />} /> 
          <Route path="/player/:tag" element={<PlayerDetail />} /> 
          <Route path="/clans" element={<ClanSearch />} /> 
          <Route path="/clan/:tag" element={<ClanDetail />} /> 

          <Route path="/" element={<BaseHome />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
              <ProtectedRoute>
                <UploadBase />
              </ProtectedRoute>
            } />
          {/* Route untuk Edit (dengan id) - pakai component yang sama */}
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <UploadBase mode="edit" />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;