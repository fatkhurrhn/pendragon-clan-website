// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import BaseHome from './pages/BaseHome';
import UploadBase from './pages/UploadBase';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BaseHome />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadBase />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;