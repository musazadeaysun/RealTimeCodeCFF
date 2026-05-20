import React from 'react'
import "./StudentPanel.css";
import { getRoomApi } from '../../../api/roomApi';
import { MdOutlineLogout } from "react-icons/md";
const StudentPanel = () => {
    const studentName = localStorage.getItem("studentName");
const roomCode = localStorage.getItem("roomCode");
  return (
    <div className='studentPanel'> 
    {/* left */}
    <div className='studentPanelHeader'>
       <div className='panelHeaderLeft'>
<p>Room: <span>{roomCode}</span></p>
<p>Name: <span>{studentName}</span></p>
</div>
{/* right */}
<div className='panelHeaderRight'>
<button>Run</button>
<MdOutlineLogout className='iconLogOut'/>
</div> 
    </div>

    </div>
  )
}

export default StudentPanel