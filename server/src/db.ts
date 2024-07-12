import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

interface product {id: number, category: string, name: string, pic: string, description: string, price: number}

interface User {username: string, password: string, domain: string}

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
}).promise();

async function addProduct(product: product) {
	console.log(product)
	const resp = await db.query("INSERT INTO products (category, name, pic, description, price) VALUES (?, ?, ?, ?, ?)", [product.category, product.name, product.pic, product.description, product.price])

	return resp
}

async function getProducts() {
	const [rows] = await db.query("SELECT * FROM products")

	return rows
}

async function getProductById(id: string): Promise<product | undefined> {
	const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

	return rows[0]
}

async function getProductByCategory(category: string) {
	const [rows] = await db.query("SELECT * FROM products WHERE category = ?", [category]);

	return rows
}

async function deleteProduct(id: string) {
	const resp = await db.query("DELETE FROM products where id = ?", [id])

	return resp
}

async function updateProduct(product :product) {
	const resp = await db.query("UPDATE products SET category = ?, name = ?, pic = ?, description = ?, price = ? WHERE id = ?", [product.category, product.name, product.pic, product.description, product.price, product.id])
	return resp
}

async function findUser(username: string): Promise<User> {
	const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username])
	console.log(users)
	const user: User = { username: users[0].username, password: users[0].password, domain: users[0].domain }
	return user;
}

export { getProducts, getProductById, getProductByCategory, deleteProduct, updateProduct, addProduct, findUser };