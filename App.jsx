import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';

const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="navbar">
          <h1 className="logo">MusicHub</h1>
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/create" className="nav-link">Create Post</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
