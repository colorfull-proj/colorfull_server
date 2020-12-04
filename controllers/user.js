const { util, statusCode, responseMessage } = require('../modules');
const User = require('../models/user');

module.exports = {
    signUp: async (req, res) => {
        const { id, password, name, type, gender, age, description } = req.body;
        if (!id || !password || !name || !type || !gender || !age) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        try {
            if (await User.checkUserId(id)) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.ALREADY_ID));
            const uid = await User.signUp(id, password, name, type, gender, age, description ? description : '');

            res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.CREATED_USER, { uid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    signIn: async (req, res) => {
        const { id, password } = req.body;
        if (!id || !password) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        
        try {
            if (!await User.checkUserId(id)) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_USER));

            const result = await User.signIn(id, password);
            if (result === -1) return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.MISS_MATCH_PW));
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, {
                user: result
            }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
};
