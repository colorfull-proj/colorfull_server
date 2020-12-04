const { pool } = require('../modules');
const { v4: uuid } = require('uuid');

const table = 'POST_EMPATHY_TB';

module.exports = {
    checkPostEmpathy: async (pid, uid) => {
        try {
            const result = await pool.queryParam(`SELECT * FROM ${table} WHERE pid="${pid}" and uid="${uid}"`);
            if (result.length === 0) return false;
            return true;
        } catch (err) {
            console.log('check post empathy ERROR', err);
            throw err;
        }
    },
    getPostEmpathys: async () => {
        try {
            return await pool.queryParam(`SELECT * FROM ${table}`);
        } catch (err) {
            console.log('get post empathys ERROR', err);
            throw err;
        }
    },
    getPostEmpathysByPid: async (pid) => {
        try {
            return await pool.queryParam(`SELECT * FROM ${table} WHERE pid="${pid}"`);
        } catch (err) {
            console.log('get post empathys by pid ERROR', err);
            throw err;
        }
    },
    createPostEmpathy: async (pid, uid) => {
        const peid = uuid();
        try {
            await pool.queryParam(`INSERT INTO ${table}(peid, pid, uid, createdAt) VALUES("${peid}", "${pid}", "${uid}", ${new Date().getTime()})`);
            return peid;
        } catch (err) {
            console.log('create post empathy ERROR', err);
            throw err;
        }
    },
    deletePostEmpathy: async (pid, uid) => {
        try {
            await pool.queryParam(`DELETE FROM ${table} WHERE pid="${pid}" and uid="${uid}"`);
        } catch (err) {
            console.log('delete post empathy ERROR', err);
            throw err;
        }
    }
}