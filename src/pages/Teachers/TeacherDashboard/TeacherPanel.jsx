import React from "react";
import "./TeacherPanel.css";
import { FaUserTie } from "react-icons/fa";

const TeacherPanel = ({ activeStudents = [] }) => {
  return (
    <div className="rightPanel">
        <h2>Xoş Gəldiniz.</h2>
      {activeStudents.length === 0 ? (
        <div className="emptyState">
            <FaUserTie className="iconNoUsers"/>
          <p>Heç bir şagird aktiv deyil.</p>
          <p className="emptyStateMessage">Şagirdlərin otağa qoşulmasını gözləyin.</p>
        </div>
      ) : (
        <h2>Xoş Gəldiniz.</h2>
      )}
    </div>
  );
};

export default TeacherPanel;