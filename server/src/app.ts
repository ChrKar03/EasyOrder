import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcrypt';

dotenv.config();

import { getProducts, getProductById, getProductByCategory, deleteProduct, updateProduct, addProduct, findUser } from "./db";

interface Product { id: number, category: string, name: string, pic: string, description: string, price: number }
interface User {username: string, password: string, domain: string}

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/products', async (req, res) => {
    const products = await getProducts();
    res.status(200).send(products);
});

app.get('/products/:category', async (req, res) => {
    const category = req.params.category;
    const products = await getProductByCategory(category);
    res.status(200).send(products);
});

app.put('/products/addnew', async (req, res) => {
    const product: Product = req.body;
    const resp = await addProduct(product);
    res.status(201).send(resp);
});

app.put('/products', async (req, res) => {
    const product: Product = req.body;
    const resp = await updateProduct(product);
    res.status(201).send(resp);
});

app.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    const resp = await deleteProduct(id);
    res.status(201).send();
});

app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const product = await getProductById(id);
    res.send(product);
});

app.post('/login', async (req, res) => {
    const user = await findUser(req.body.username);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
        res.status(201).send(user.domain);
    } else {
        res.send('Not Allowed');
    }
});

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
    console.log('The application is listening on port ' + port);
});