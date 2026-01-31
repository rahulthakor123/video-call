
import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css"
import { Button, IconButton, TextField } from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore';
import logo from '../assets/logo3.png';
import { AuthContext } from '../context/AuthContext'



export const HomePage = () => {

  let navigate = useNavigate();
  const [Meetingcode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinCall = async () => {
    await addToUserHistory(Meetingcode);
    navigate(`/${Meetingcode}`);

  }
  return (
    <>
      <div className='navbar'>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h4>My Video Call</h4>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate("/history")}>
            <RestoreIcon /><p>History</p></IconButton>
          <Button onClick={() => {
            localStorage.removeItem("Token");
            navigate("auth");
          }}>LogOut</Button>
        </div>

        <div className='meetContainer'>
          <div className='leftPanel'>
            <div>
              <h2>Providing Quality VIdeo Call Just Like Quality Education</h2>
              <div style={{ display: "flex", gap: "10px" }}>

                <TextField onChange={e => setMeetingCode(e.target.value)} id='outlined-basic' label="Meeting Code" variant='outlined' />
                <Button onClick={handleJoinCall} variant='contained'>Join</Button>
              </div>


            </div>
          </div>
          <div className='rightPanel'>
            <img src={logo} alt='' />
          </div>
        </div>

      </div>
    </>
  )
}

export default withAuth(HomePage);
