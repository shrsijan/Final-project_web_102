import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-item">Home</NavLink>
            <NavLink to="/create" className="nav-item">Create New Post</NavLink>
            <NavLink to="/profile" className="nav-item">Profile</NavLink>
        </nav>
    );
};

export default Navbar;
