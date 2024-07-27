// src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import { LifeSystemProvider, LifeSystemContext } from './context/life-system.context';
import { AuthContext } from './context/auth.context';
import Navigation from './components/navigation/navigation.component';
import Dashboard from './pages/dashboard/dashboard.component';
import DailyLog from './pages/daily-log/daily-log.component';
import ConversionRules from './pages/conversion-rules/conversion-rules.component';
import AuthForms from './components/auth-forms/auth-forms.component';
import './App.scss';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { isDemo } = useContext(LifeSystemContext);

  if (user || isDemo) {
    return children;
  }

  return <Navigate to="/login" />;
};

function App() {
  const { isDemo } = useContext(LifeSystemContext);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/login" element={<AuthForms />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/daily-log" element={
            <PrivateRoute>
              <DailyLog />
            </PrivateRoute>
          } />
          <Route path="/conversion-rules" element={
            <PrivateRoute>
              <ConversionRules />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

const AppWithProviders = () => (
  <AuthProvider>
    <LifeSystemProvider>
      <App />
    </LifeSystemProvider>
  </AuthProvider>
);

export default AppWithProviders;