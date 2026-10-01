import { useEffect, useState } from "react"
import Navbar from "../Components/Navbar"
import '../css/categories.css'
import { data } from "react-router-dom";

function CategoriesMenu(){
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    //Load Categories

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/categories')
    //         .then((res) => res.json())
    //         .then(setCategories)
    //         .catch((err) => console.error('Failed to load Categories', err));
    // }, [refreshKey]);
    
   useEffect(() => {
        fetch('http://localhost:5000/api/categories')
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort((a, b) =>
                    //case-insensitive sort
                    a.name.localeCompare(b.name, undefined, { sensitivity: 'base'}) 
                );
                setCategories(sorted);
            })
            .catch((err) => console.error('Failed to load Categories', err));
    }, [refreshKey]);

    //Add Category
    const handleAddCategory = async() => {
        try{
            const res = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({name: categoryName.trim()})
            });

            if (!res.ok) throw new Error ('Failed to add category');
            setCategoryName('');
            setRefreshKey((prev) => prev + 1);
        } catch (err){
            console.error(err);
        }
    }

    // Delete Category
    const handleDeleteCategory = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to Delete');

            setCategories((prev) => prev.filter((cat) => cat._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return(
        <div className="container">
            {/*<Navbar /> */}
            <div className="categories-wrapper">
                <h2>Manage Categories</h2>
                
                {/* Input Form Card */}
                <div className="category-form-card">
                    <div className="form-group-inline">
                        <input
                            type="text"
                            placeholder="Enter Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button className="add-btn" onClick={handleAddCategory}>
                            Add Category
                        </button>
                    </div>
                </div>

                {/* Categories List Card */}
                <div className="category-list-card">
                    <h3>Categories</h3>
                    <ul className="category-list">
                        {categories.map((cat) => (
                            <li key={cat._id} className="category-item">
                                <span className="category-name">{cat.name}</span>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeleteCategory(cat._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
        </div>
    );

}

export default CategoriesMenu