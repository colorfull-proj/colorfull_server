const { pool } = require('../modules');
const { v4: uuid } = require('uuid');

const table = 'COMMENT_TB';


module.exports = {
    getComment: async (cid) => {
        try {
            const comment = await pool.queryParam(`SELECT * FROM ${table} WHERE cid="${cid}"`);
            if (comment.length === 0) return -1;
            return comment[0];
        } catch (err) {
            console.log('get comment ERROR', err);
            throw err;
        }
    },
    getCommentsByPid: async (pid) => {
        try {
            return await pool.queryParam(`SELECT * FROM ${table} WHERE pid="${pid}"`);
        } catch (err) {
            console.log('get comments by pid ERROR', err);
            throw err;
        }
    },
    uploadComment: async (pid, uid, content, pictureURL) => {
        const cid = uuid();
        const now = new Date().getTime();

        const field = 'cid, pid, uid, content, pictureURL, createdAt, updatedAt';
        const questions = '?, ?, ?, ?, ?, ?, ?'
        const query = `INSERT INTO ${table}(${field}) VALUES(${questions})`;
        const values = [cid, pid, uid, content, pictureURL, now, now];
        try {
            await pool.queryParamArr(query, values);
            return cid;
        } catch (err) {
            console.log('create comment ERROR', err);
            throw err;
        }
    },
    updateComment: async (cid, content, pictureURL) => {
        const query = `UPDATE ${table} SET content="${content}", pictureURL="${pictureURL}", updatedAt=${new Date().getTime()} WHERE cid="${cid}"`;
        try {
            await pool.queryParam(query);
            return cid;
        } catch (err) {
            console.log('update comment ERROR', err);
            throw err;
        }
    },
    deleteComment: async (cid) => {
        try {
            await pool.queryParam(`DELETE FROM ${table} WHERE cid="${cid}"`);
            return cid;
        } catch (err) {
            console.log('delete comment ERROR', err);
            throw err;
        }
    }
    

}