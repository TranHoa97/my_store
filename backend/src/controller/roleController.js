import db from "../models/db"

const roleController = {
    getAllRoles: async (req, res) => {
        try {
            const sql = `select * from role`
            
            const [roles] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get roles successfully!",
                data: roles.length > 0 ? roles : []
            })
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

export default roleController
