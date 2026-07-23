
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
 const isGuest = localStorage.getItem("isGuest") === "true";
  const [Meetingcode, setMeetingCode] = useState("");

  const { addToUserHistory,createMeeting } = useContext(AuthContext);

  let handleJoinCall = async () => {
    await addToUserHistory(Meetingcode);
    navigate(`/${Meetingcode}`);

  }

  // const handleCreateMeeting = async () => {
  //   const code = await createMeeting();

  //   await addToUserHistory(code);
  //   navigate(`/${code}`);


  // }
  
const handleCreateMeeting = async () => {
  const code = await createMeeting();

  await addToUserHistory(code);

  // Go to Meeting Lobby instead of Video Page
  navigate(`/meeting/${code}`);
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
         {!isGuest && (
  <Button
    onClick={() => {
      localStorage.removeItem("Token");
      navigate("/auth");
    }}
  >
    LogOut
  </Button>
)}
        </div>

        <div className='meetContainer'>
          <div className='leftPanel'>
            <div>
              <h2>Providing Quality VIdeo Call Just Like Quality Education</h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <TextField onChange={e => setMeetingCode(e.target.value)} id='outlined-basic' label="Meeting Code" variant='outlined' />
                <Button onClick={handleJoinCall} variant='contained'>Join</Button>
                <Button
                 variant="contained"
                  onClick={handleCreateMeeting}
>
                 Create Meeting</Button>
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
