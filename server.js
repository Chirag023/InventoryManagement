import Datastore from 'nedb-promises';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import formatDate from './src/utils/date.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const PORT = 5000;


app.listen(PORT, () =>{
    console.log(`Server running with NeDB at port: ${PORT}`);
});

//Initialize NeDB with persistence filename & automatic loading

const itemsDB = Datastore.create({
    filename: path.join(__dirname, 'data', 'items.db'),
    autoload: true,
    timestampData: true
});

const categoriesDB = Datastore.create({
    filename: path.join(__dirname,'data', 'categories.db'),
    autoload: true
});


itemsDB.compactDatafile(); //clear duplicates every run./restarrt
//itemsDB.setAutocompactionInterval(3600000); //Auto clear duplicates every hour

app.use(cors());
app.use(express.json());

//INVENTORY
// Get all items

app.get('/api/items', async (req, res) => {
    try{
        const items = await itemsDB.find({}).sort({createdAt: 1});
        res.json(items);
    } catch (err){
        console.error(err);
        res.status(500).json({error: 'Failed to read items'});
    }
});

// Add new items

app.post('/api/items', async (req, res) =>{
    try{
        const { name, categoryId, amount, price } = req.body;
        if(!name || !name.trim()) {
            return res.status(400).json({ error: 'Item name required'});

        }

        const newItem = {
            name: name.trim(),
            categoryId: categoryId || 'N/A',//save categoryId
            amount: Number(amount),
            price: Number(price)
        };

        const insertedItem = await itemsDB.insert(newItem);
        res.status(201).json(insertedItem);
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Failed to write'});
    }
});

// Delete Item

app.delete('/api/items/:id', async (req, res) => {

    try{
        const id = req.params.id;

        const numRemoved = await itemsDB.remove({_id: id}, {multi: false});

        if(numRemoved === 0){
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(204).end();
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
    
});

// Update Item

app.patch('/api/items/:id', async (req, res) => {

    try{
        const id = req.params.id;
        const updateData = req.body;
        
        const numUpdated = await itemsDB.update(
            { _id: id }, 
            { $set: updateData }, 
            {}
        );

        if (numUpdated === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.status(200).json({ success: true, updatedCount: numUpdated });
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to Update item' });
    }
    
});

//Category

//get categories
app.get('/api/categories', async (req, res) => {
    try{
        const categories = await categoriesDB.find({}).sort({name: 1});
        res.json(categories);
    } catch (err){
        console.error(err);
        res.status(500).json({error: 'Failed to read categories'});
    }
});

// Add new category
app.post('/api/categories', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Category name required' });
        }

        const newCategory = { name: name.trim() };
        const insertedCategory = await categoriesDB.insert(newCategory);
        res.status(201).json(insertedCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to write category' });
    }
});

// Delete Category
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const numRemoved = await categoriesDB.remove({ _id: id }, { multi: false });

        if (numRemoved === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

/* 

//Using JSON as database

// const DATA_DIR = path.join(__dirname, 'data')
// const DATA_FILE = path.join(DATA_DIR, 'items.json');


//check for JSON file
async function ensureFile(){
    try{
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, '[]', 'utf-8');
    }
}

//read JSON file
async function readItem(){
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data || '[]');
}

//write from JSON file
async function writeItem(items) {
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

//GET all items
app.get('/api/items', async (req, res) => {
    try{
        const items = await readItem();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read items' });
    }
});

//Add new Item
app.post('/api/items/', async (req, res) => {
    try{
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400). json({ error: 'Item name is required' });
        }

        const items = await readItem();
        const newItem = {id: formatDate(Date.now()), name: name.trim() };
        items.push(newItem);
        await writeItem(items);

        res.status(201).json(newItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to write' });
    }
});

//Delete Item
app.delete('/api/items/:id', async (req, res) => {
    try{
        const id = Number(req.params.id);
        const items = await readItem();
        const filtered = items.filter((item) => item.id !== id);
        await writeItem(filtered);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
}); 


ensureFile().then(() =>{
    app.listen(PORT, () => {
        console.log(`Server running at port: ${PORT}`);
    })
})


*/
