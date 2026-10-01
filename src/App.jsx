import { Routes, Route, Link} from 'react-router-dom';
import AddItem from './home/AddItem';
import Home from './home/Home';
import CategoriesMenu from './admin/CategoriesMenu';
import './css/layout.css'

function App() {
  return (
      <div className="app-layout">
        {/* Sidebar Component */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h2>Inventory Management</h2>
          </div>
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link">Home</Link>
            <Link to="/addItem" className="sidebar-link">Add Items</Link>
            <Link to="/categories" className="sidebar-link">Categories</Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addItem" element={<AddItem />} />
            <Route path="/categories" element={<CategoriesMenu />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;