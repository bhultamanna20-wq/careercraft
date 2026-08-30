import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import About from './pages/About';
import Contact from './pages/Contact';
import JobMatches from './pages/JobMatches';
import Preview from './pages/Preview';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:resumeId" element={<Editor />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jobs/:resumeId" element={<JobMatches />} />
        <Route path="/preview/:resumeId" element={<Preview />} />
        </Routes>
   </BrowserRouter>
  );
}


export default App;