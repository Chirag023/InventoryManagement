import { useEffect, useState } from 'react'
import Inventory from '../inventory/inventory';
import '../css/additem.css'

function AddItem() {
//   const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); //trigger inventory refresh
  const [imageFile, setImageFile] = useState(null); // State for img file

  //load categories
  useEffect(() => {
        fetch('http://localhost:5000/api/categories')
            .then((res) => res.json())
            .then(setCategory)
            .catch((err) => console.error('Failed to load Categories: ', err));
    }, []);
  
  //add items
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use FormData because we are sending a file alongside text data
    const formData = new FormData();
    formData.append('name', itemName);
    formData.append('categoryId', selectedCategory);
    formData.append('price', price);
    formData.append('amount', amount);
    if (imageFile) {
        formData.append('image', imageFile); // Append the actual file
    }

    try{
        const res = await fetch('http://localhost:5000/api/items', {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to add item');

        //Reset form
        setItemName('');
        setSelectedCategory('');
        setAmount('');
        setPrice('');
        setRefreshKey((prev) => prev + 1);
    } catch (err) {
        console.error(err);
    };

  };

  return (
    <div className = "container">
        {/*<Navbar /> */}

        <div className="add-item-wrapper">
            <div className="add-item-card">
                <form onSubmit={handleSubmit} className="add-item-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="" hidden>Select Category</option>
                            {Array.isArray(category) && category.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Initial Amount</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Price (RS.)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* File Input for Images */}
                    <div className="form-group">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setImageFile(e.target.files[0])} 
                        />
                    </div>

                    <button type="submit" className="add-btn" >
                        Add Item
                    </button>
                </form>
            </div>
        </div>

        <Inventory refreshKey = {refreshKey}/>
            
    </div>
  )
}

export default AddItem