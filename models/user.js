const { pool } = require('../modules');
const { v4: uuid } = require('uuid');

const table = 'USER_TB';


module.exports = {
    signUp: async (id, password, name, type, gender, age, description) => {
        const fields = 'uid, id, name, password, type, gender, age, description, createdAt, updatedAt';
        const questions = `?, ?, ?, ?, ?, ?, ?, ?, ?, ?`;
        const now = new Date().getTime();
        const uid = uuid();
        const values = [uid, id, name, password, type, gender, age, description, now, now];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
        try {
            await pool.queryParamArr(query, values);
            return uid;
        } catch (err) {
            console.log('signup ERROR : ', err);
            throw err;
        }
    },
    checkUserId: async (id) => {
        const query = `SELECT * FROM ${table} WHERE id="${id}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.length === 0) {
                return false;
            } else return true;
        } catch (err) {
            console.log('checkUser ERROR : ', err);
            throw err;
        }
    },
    signIn: async (id, password) => {
        const query = `SELECT * FROM ${table} WHERE id="${id}"`;
        try {
            await pool.queryParam(`UPDATE ${table} SET lastLoginedAt=${new Date().getTime()} WHERE id="${id}"`);
            const result = await pool.queryParam(query);
            if (result.length === 0) return -1;
            if (result[0].password !== password) return -1;
            return result[0];
        } catch (err) {
            console.log('checkUser ERROR : ', err);
            throw err;
        }
    },
    getUsers: async () => {
        try {
            return await pool.queryParam(`SELECT * FROM ${table}`);
        } catch (err) {
            console.log('get users ERROR', err);
            throw err;
        }
    },
    getUser: async (uid) => {
        try {
            const result = await pool.queryParam(`SELECT * FROM ${table} WHERE uid="${uid}"`);
            if (result.length === 0) return -1;
            return result[0];
        } catch (err) {
            console.log('get user ERROR', err);
            throw err;
        }
    }};