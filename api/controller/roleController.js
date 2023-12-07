const db = require("../model/db")
const bcrypt = require('bcrypt')
require("dotenv").config()

const roleController = {
    getAllRoles: async (req, res) => {
        try {
            const sql = `select * from roles`
            
            const [roles] = await db.execute(sql)

            if(roles.length > 0) {
                return res.status(200).json({
                    st: 1,
                    msg: "Get roles successfully!",
                    data: roles
                })
            } else {
                return res.status(200).json({
                    st: 1,
                    msg: "No roles!",
                    data: []
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createRole: async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateRole: async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteRole: async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

module.exports = roleController