import React from 'react';
import { Link } from 'react-router-dom';
import './navigation.styles.scss';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/daily-log">Daily Log</Link></li>
        <li><Link to="/conversion-rules">Conversion Rules</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;