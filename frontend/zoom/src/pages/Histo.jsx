
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';

export default function Histo() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                console.log(history.meetings);

                setMeetings(history?.meetings || []);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        console.log("Received Date:", dateString);
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <IconButton onClick={() => routeTo("/home")}>
                <HomeIcon />
            </IconButton>

            {
                meetings.length === 0 ? (
                    <Typography>No meeting history found.</Typography>
                ) : (
                   

         meetings.map((e, i) => (
           <Card key={i} variant="outlined" sx={{ mb: 2, p: 1 }}>
             <CardContent>

             {/* Meeting Code */}
               <Typography variant="h6">
           🔗 {e.meetingCode}
                    </Typography>
                            {/* Date */}
          <Typography sx={{ fontSize: 14, color: "gray" }}>
                📅 {formatDate(e.date)}
            </Typography>

            {/* Buttons */}
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        console.log("Joining:", e.meetingCode);
                        routeTo(`/${e.meetingCode}`)}}
                >
                    Join Again
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigator.clipboard.writeText(e.meetingCode)}
                >
                    Copy Code
                </Button>

            </div>

        </CardContent>
    </Card>
))
                )
            }
        </div>
    );
}
