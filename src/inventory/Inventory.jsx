import { useEffect, useState } from "react"
import '../css/Inventory.css'

function Inventory({ refreshKey }){
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState([]);

    //load Items
    useEffect(() => {
        fetch('http://localhost:5000/api/items')
            .then((res) => res.json())
            .then(setItems)
            .catch((err) => console.error('Failed to load Items:', err));
    
        fetch('http://localhost:5000/api/categories')
            .then((res) => res.json())
            .then((data) => {
                //console.log("Loaded Categories:", data); // Check your browser console!
                setCategory(data);
            })
            .catch((err) => console.error('Failed to load Categories:', err));
    }, [refreshKey]);

    //Delete items
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/items/${id}`, {
                method : 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to Delete');

            setItems((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error(err);
        }   
    };

    //handle amount change
    const handleUpdateAmount = async (id, newAmount) => {
        const validatedAmount = Math.max(0, Number(newAmount) || 0);
        try {
            const res = await fetch(`http://localhost:5000/api/items/${id}`, {
                method: 'PATCH', // or PUT/PATCH depending on backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: validatedAmount })
            });

            if (!res.ok) throw new Error('Failed to update amount');

            // Update state locally
            setItems((prev) => prev.map(item => 
                item._id === id ? { ...item, amount: validatedAmount } : item
            ));
        } catch (err) {
            console.error(err);
        }
    };

    // Find category name by ID
    const getCategoryName = (categoryId) => {
        if(!categoryId) return 'Unknown';
        const found = category.find((cat) => cat._id === categoryId);
        return found? found.name : 'N/A';
    }
    
    return(
        <div className="container">
            <div className="Inventory">
                {items.length >0 ? (
                    <div className="inventory-grid">
                        {items.map((item) => (
                            <div className="inventory-card" key={item._id}>
                                <div className="card-name">{item.name}</div>

                                <div className="card-image-box">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </div>
                                
                                {/*}
                                <p>
                                    {getCategoryName(item.categoryId)} 
                                </p>
                                */}

                                <div className="card-price-box">
                                    RS. {item.price || 0}
                                </div>

                                <div className="card-bottom-row">
                                    <div className="amount-control">
                                        <button onClick={() => handleUpdateAmount(item._id, (item.amount || 0) - 1)}>&lt;</button>
                                        <input 
                                            type="text"
                                            className="amount-display"
                                            value={ item.amount || 0}
                                            onChange={(e) => {
                                                // Allows typing freely, updating the state locally right away
                                                const updatedVal = Number(e.target.value);
                                                setItems((prev) => prev.map(i => 
                                                    i._id === item._id ? { ...i, amount: updatedVal } : i
                                                ));
                                            }}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter'){
                                                    const newAmount = Number(e.target.value);
                                                    handleUpdateAmount(item._id, newAmount);
                                                    e.target.blur();
                                                } 
                                            }}
                                        />
                                           

                                        <button onClick={() => handleUpdateAmount(item._id, (item.amount || 0) + 1)}>&gt;</button>
                                    </div>

                                    <button
                                        className='delBtn'
                                        onClick={() => handleDelete(item._id)}
                                        aria-label={`Delete ${item.name}`}
                                    >
                                        delete
                                    </button>
                                </div>
                            </div>
                                
                        ))}
                    </div>
                ):(
                    <p>No Items found</p>
                )}
            </div>
        </div>
    )
}

export default Inventory