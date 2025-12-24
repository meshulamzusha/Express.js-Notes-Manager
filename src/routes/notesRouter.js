import express from 'express';
import { promises } from 'fs';

const router = express.Router();


router.use(async (req, res, next) => {
    try {
        const username = req.headers["user-auth"];

        if (!username) {
            return res.status(401).send('Unauthorized')
        }

        const usersRaw = await promises.readFile('./data/users.json');
        const users = JSON.parse(usersRaw);
        const isUserExist = users.some(u => u.username == username);

        if (!isUserExist) {
            return res.status(401).send('Unauthorized')
        }

        next()
    } catch (error) {
        console.log(error);
    }
})

router.get('/', async (req, res) => {
    try {
        const username = req.headers["user-auth"]
        const notesRaw = await promises.readFile('./data/users.json');
        const notes = JSON.parse(usersRaw);
        const notesForUser = notes.filter(n => n.username == username);

        res.json(notesForUser)
    } catch (error) {
        console.log(error)
    }
})


router.post('/', async (req, res) => {
    try {
        const content = req.body.content;
        const owner = req.headers["user-auth"];
        const id = `n${Date.now()}`;

        const note = {
            id: id,
            owner: owner,
            content: content
        }

        const notesRaw = await promises.readFile('./data/notes.json');
        const notes = JSON.parse(notesRaw);

        notes.push(note);
        await promises.writeFile('./data/notes.json', JSON.stringify(notes, null, 2));

        res.send("Note added successfully.")
    } catch (error) {
        console.log(error);
    }
})


router.put('/:id', async (req, res) => {
    try {
        const newContent = req.body.content
        const noteId = req.params.id;
        const username = req.headers["user-auth"];

        if (!username) {
            return res.status(401).send("Unauthorized")
        }

        const notesRaw = await promises.readFile('./data/notes.json');
        const notes = JSON.parse(notesRaw);
        const index = notes.findIndex(n => n.id == noteId)

        if (index == -1) {
            return res.status(404).send("note not found.")
        }

        if (notes[index].owner != username) {
            return res.status(403).send("You are forbidden update a note that you don't own.")
        }

        notes[index].content = newContent;

        await promises.writeFile('./data/notes.json', JSON.stringify(notes, null, 2));

        res.json({
            note: notes[index],
            message: "content in note updated successfully"
        })

    } catch (error) {
        console.log(error);
    }
})

export default router;