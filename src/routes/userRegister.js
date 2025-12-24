import { Router } from 'express';
import fs from 'fs'

const router = Router();

console.log('User Register Router loaded');

router.post('/', async (req, res) => {
    console.log('Registering user:', req.body);
    const userName = req.body.username;
    const data = await fs.promises.readFile('./data/users.json', 'utf-8');
    const users = JSON.parse(data);
    const userExists = users.some(user => user.username === userName);
    if (userExists)
        return res.status(400).json({ error: 'Username already exists' });
    const newUser = {
        id: `u${Date.now()}`,
        username: userName
    };
    users.push(newUser);
    await fs.promises.writeFile('./data/users.json', JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'User registered successfully', user: newUser });
})

export default router;