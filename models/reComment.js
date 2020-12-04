const { pool } = require('../modules');
const { v4: uuid } = require('uuid');

const table = 'RECOMMENT_TB';

module.exports = {
    getReComment: async (rcid) => {
        try {
            const reComment = await pool.queryParam(`SELECT * FROM ${table} WHERE rcid="${rcid}"`);
            if (reComment.length === 0) return -1;
            return reComment[0];
        } catch (err) {
            console.log('get recomment ERROR', err);
            throw err;
        }
    },
    getReCommentsByCid: async (cid) => {
        try {
            return await pool.queryParam(`SELECT * FROM ${table} WHERE cid="${cid}"`);
        } catch (err) {
            console.log('get recomments by cid ERROR', err);
            throw err;
        }
    },
    uploadReComment: async (cid, uid, content) => {
        const rcid = uuid();
        const now = new Date().getTime();

        const field = 'rcid, cid, uid, content, createdAt, updatedAt';
        const questions = '?, ?, ?, ?, ?, ?'
        const query = `INSERT INTO ${table}(${field}) VALUES(${questions})`;
        const values = [rcid, cid, uid, content, now, now];
        try {
            await pool.queryParamArr(query, values);
            return rcid;
        } catch (err) {
            console.log('create recomment ERROR', err);
            throw err;
        }
    },
    updateReComment: async (rcid, content) => {
        const query = `UPDATE ${table} SET content="${content}", updatedAt=${new Date().getTime()} WHERE rcid="${rcid}"`;
        try {
            await pool.queryParam(query);
            return rcid;
        } catch (err) {
            console.log('update recomment ERROR', err);
            throw err;
        }
    },
    deleteReComment: async (rcid) => {
        try {
            await pool.queryParam(`DELETE FROM ${table} WHERE rcid="${rcid}"`);
            return rcid;
        } catch (err) {
            console.log('delete recomment ERROR', err);
            throw err;
        }
    }
    

}