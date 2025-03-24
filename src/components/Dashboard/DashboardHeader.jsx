import React from 'react';
import './dashboard.css'; // We'll define this stylesheet separately

function DashboardHeader({ title, rightContent }) {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        {title || "Dashboard"}
      </div>
      <div className="header-actions">
        {rightContent}
      </div>
    </header>
  );
}

export default DashboardHeader;