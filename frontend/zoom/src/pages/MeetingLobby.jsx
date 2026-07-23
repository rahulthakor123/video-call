import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useNavigate, useParams } from "react-router-dom";

const MeetingLobby = () => {
  const { meetingCode } = useParams();
  const navigate = useNavigate();

  const meetingLink = `${window.location.origin}/${meetingCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert("Meeting link copied!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(meetingCode);
    alert("Meeting code copied!");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: "100%", borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>

            <Box textAlign="center" mb={3}>
              <VideocamIcon
                sx={{
                  fontSize: 70,
                  color: "#1976d2",
                }}
              />

              <Typography variant="h4" fontWeight="bold" mt={1}>
                Meeting Lobby
              </Typography>

              <Typography color="text.secondary">
                Share this meeting with others before joining.
              </Typography>
            </Box>

            <Typography fontWeight="bold">
              Meeting Code
            </Typography>

            <Card
              variant="outlined"
              sx={{
                mt: 1,
                mb: 3,
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h5">
                {meetingCode}
              </Typography>
            </Card>

            <Typography fontWeight="bold">
              Share Link
            </Typography>

            <Card
              variant="outlined"
              sx={{
                mt: 1,
                mb: 3,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {meetingLink}
              </Typography>
            </Card>

            <Stack spacing={2}>

              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={copyLink}
              >
                Copy Link
              </Button>

              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={copyCode}
              >
                Copy Meeting Code
              </Button>

              <Button
                size="large"
                variant="contained"
                onClick={() => navigate(`/${meetingCode}`)}
              >
                Join Meeting
              </Button>

            </Stack>

          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default MeetingLobby;