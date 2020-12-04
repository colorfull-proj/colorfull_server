const { util, statusCode, responseMessage } = require('../modules');
const _ = require('lodash');
const Empathy = require('../models/postEmpathy');

module.exports = {
    createEmpathy: async (req, res) => {
        const pid = req.params.pid;
        const { uid } = req.body;
        if (!pid || !uid) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        try {
            if (await Empathy.checkPostEmpathy(pid, uid)) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.ALREADY_EMPATHY));
            const peid = await Empathy.createPostEmpathy(pid, uid);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.POST_EMPATHY_SUCCESS, { peid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    deleteEmpathy: async (req, res) => {
        const { pid, uid } = req.params;
        try {
            if (!await Empathy.checkPostEmpathy(pid, uid)) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_POST_EMPATHY));
            await Empathy.deletePostEmpathy(pid, uid);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.DELETE_EMPATHY_SUCCESS));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    }
};
