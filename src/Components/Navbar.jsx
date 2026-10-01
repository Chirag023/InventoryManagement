import { Link } from "react-router-dom";
import '../css/navbar.css'

function Navbar(){
    return(
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/addItem" className="nav-link">Add Items</Link>
                <Link to="/categories" className="nav-link">Categories</Link>
            </div>
        </nav>
    )
}

export default Navbar;