import db from "../models/db"

const roleController = {
    getAllRoles: async (req, res) => {
        try {
            const action = ["view", "create", "update", "delete"]

            const [manage] = await db.execute(
                `select distinct manage from role`
            )

            const [roles] = await db.execute(
                `select * from role`
            )

            let results = []
            for (let i = 0; i < manage.length; i++) {
                let newRoles = roles.filter(item => manage[i].manage === item.manage)
                let newArr = []
                for (let j = 0; j < action.length; j++) {
                    const newAction = action[j]
                    for (let e = 0; e < newRoles.length; e++) {
                        if(newAction === newRoles[e].action) {
                            newArr.push(newRoles[e])
                        }
                    }
                }
                results.push({
                    manage: manage[i].manage,
                    roles: newArr
                })
            }

            return res.status(200).json({
                st: 1,
                msg: "Get roles successfully!",
                data: {
                    action: action,
                    data: results
                }
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
