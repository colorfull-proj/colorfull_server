var express = require('express');
var router = express.Router();

const url = 'data/memberData.json';
const fs = require('fs');

const Util = {
    success: (status, data, message) => { 
        return {
            status,
            success: true,
            message,
            data
        }
    },
    fail: (status, message) => {
        return {
            status,
            success: false,
            message
        }
    }
}

const UserAPI = {
    getUsers: async () => {
        return JSON.parse(await fs.readFileSync(url));
    },
    getUser: async (id) => {
        return JSON.parse((await fs.readFileSync(url)))[id];
    }
}

/* GET home page. */
router.get('/', async (req, res, next) => {
    const users = await UserAPI.getUsers();
    res.status(200).send({
        success: true,
        data: users.map((user, i) => ({
            id: i,
            ...user
        }))
    });
});

router.get('/:id', async (req, res) => {
    const user = await UserAPI.getUser(req.params.id);
    return user
        ? res.status(200).send(Util.success(200, user, "[SUCCESS] GET USER"))
        : res.status(500).send(Util.fail(500, "[FAIL] NO USER"));
});

router.post('/:id', async (req, res) => {
    try {
        const users = await UserAPI.getUsers();
        const idx = users.findIndex(user => user.id + '' === req.params.id);
        if (idx === -1) return res.status(500).send(Util.fail(500, "[FAIL] NO USER"));

        if (!req.body.name || !req.body.profileUrl || !req.body.introduction || !req.body.mbti || !req.body.instagram) return res.status(500).send(Util.fail(500, "[FAIL] WRONG PROPERTIES"));
        users[idx] = { ...users[idx], ...req.body };
        console.log(users);
        await fs.writeFileSync(url, JSON.stringify(users));

        return res.status(200).send(Util.success(200, users, "[SUCCESS] UPDATE USER"));
    } catch (e) {
        return res.status(400).send(Util.fail(400, '[FAIL] INTERNER SERVER ERROR'));
    } 
});

router.put('/', async (req, res) => {
     try {
        const users = await UserAPI.getUsers();

        if (!req.body.name || !req.body.profileUrl || !req.body.introduction || !req.body.mbti || !req.body.instagram) return res.status(500).send(Util.fail(500, "[FAIL] WRONG PROPERTIES"));
        users.push({id: users[users.length - 1].id + 1, ...req.body})
        await fs.writeFileSync(url, JSON.stringify(users));

        return res.status(200).send(Util.success(200, users, "[SUCCESS] UPLOAD USER"));
    } catch (e) {
        return res.status(400).send(Util.fail(400, '[FAIL] INTERNER SERVER ERROR'));
    }
    
    
});

router.delete('/:id', async (req, res) => {
    try {
        const users = await UserAPI.getUsers();

        const idx = users.findIndex(user => user.id + '' === req.params.id);
    
        if (idx === -1) return res.status(500).send(Util.fail(500, "[FAIL] NO USER"));
       
        users.splice(idx, 1);
        await fs.writeFileSync(url, JSON.stringify(users));

        return res.status(200).send(Util.success(200, users, "[SUCCESS] DELETE USER"));
    } catch (e) {
        return res.status(400).send(Util.fail(400, '[FAIL] INTERNER SERVER ERROR'));
    } 
    
});


module.exports = router;
