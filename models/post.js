const { pool } = require('../modules');
const { v4: uuid } = require('uuid');

const table = 'POST_TB';

module.exports = {
    checkPost: async (pid) => {
        try {
            const result = await pool.queryParam(`SELECT * FROM ${table} WHERE pid="${pid}"`);
            if (result.length === 0) return false;
            return true;
        } catch (err) {
            console.log('check post ERROR', err);
            throw err;
        }
    },
    getPosts: async () => {
        try {
            return await pool.queryParam(`SELECT * FROM ${table}`);
        } catch (err) {
            console.log('get posts ERROR', err);
            throw err;
        }
    },
    getPost: async (pid) => {
        try {
            const result = await pool.queryParam(`SELECT * FROM ${table} WHERE pid="${pid}"`);
            if (result.length === 0) return -1;
            return result[0];
        } catch (err) {
            console.log('get post ERROR', err);
            throw err;
        }
    },
    uploadPost: async (uid, title, content) => {
        const fields = 'pid, uid, title, content, createdAt, updatedAt';
        const questions = `?, ?, ?, ?, ?, ?`;
        const now = new Date().getTime();
        const pid = uuid();
        const values = [pid, uid, title, content, now, now];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
        try {
            await pool.queryParamArr(query, values);
            return pid;
        } catch (err) {
            console.log('create post ERROR', err);
            throw err;
        }
    },
    updatePost: async (pid, title, content) => {
        const query = `UPDATE ${table} SET title="${title}", content="${content}", updatedAt=${new Date().getTime()} WHERE pid="${pid}"`;
        try {
            await pool.queryParam(query);
            return pid;
        } catch (err) {
            console.log('update post ERROR', err);
            throw err;
        }
    },
    deletePost: async (pid) => {
        try {
            await pool.queryParam(`DELETE FROM ${table} WHERE pid="${pid}"`);
            return pid;
        } catch (err) {
            console.log('delete post ERROR', err);
            throw err;
        }
    }
};
