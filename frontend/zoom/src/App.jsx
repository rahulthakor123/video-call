
import React from 'react';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx'; 
import AuthPage from './pages/AuthPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { VideoMeetPage } from './pages/VideoMeetPage.jsx';   
import { HomePage } from './pages/HomePage.jsx';
import Histo from './pages/Histo.jsx';   



function App() {
  return (
    <AuthProvider>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/auth" element={<AuthPage />} />
         <Route path='/:url' element={<VideoMeetPage/>}/>
        <Route path="/history" element={<Histo />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
