import { useEffect, useState } from 'react'
import Inventory from '../inventory/inventory';
import Navbar from '../Components/Navbar';
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
  const handleAddItem = async () => {
    if ( !itemName.trim()) return;

    try{
        const res = await fetch('http://localhost:5000/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: itemName.trim(),
                categoryId: selectedCategory,
                amount: Number(amount),
                price: Number(price)
            }),
    });

    if (!res.ok) throw new Error('Failed to add item');

    setItemName('');
    setSelectedCategory('');
    setAmount('');
    setPrice('');
    setRefreshKey((prev) => prev + 1);
    
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className = "container">
        {/*<Navbar /> */}

        <div className="add-item-wrapper">
            <div className="add-item-card">
    
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
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
                <div className="file-input-group">
                    <label>Item Image:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                    />
                </div>

                <button className="add-btn" onClick={handleAddItem}>
                    Add Item
                </button>
            </div>
        </div>

        <Inventory refreshKey = {refreshKey}/>
            
    </div>
  )
}

export default AddItem