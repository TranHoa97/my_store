const db = require("../model/db")

const groupController = {
    getGroups: async (req, res) => {
        try {
            let sql = `select * from my_store.groups`

            const [groups] = await db.execute(sql)

            const results = await groupController.getGroupWithRoles(groups)

            if(groups.length > 0) {
                return res.status(200).json({
                    st: 1,
                    msg: "Get groups successfully!",
                    data: results
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "No groups!",
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

    getGroupWithRoles: async(groups) => {
        let results = []
        for (let index = 0; index < groups.length; index++) {
            const [roles] = await db.execute(
                `select roles.id as role_id, roles.description from groups_roles 
                left join roles on groups_roles.role_id = roles.id 
                where groups_roles.group_id = ?`,
                [groups[index].id]
            )
            results.push({
                ...groups[index],
                roles: roles
            })
        }
        return results
    },

    createGroup: async (req, res) => {
        try {
            const { title, description, roles } = req.body

            if(!title || !description || !roles) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // insert value to groups table
            const [group] = await db.execute(
                `insert into my_store.groups (title, description) values (?,?)`, 
                [title, description]
            )

            if(group) {
                if(roles.length > 0) {
                    // insert value to group_roles table
                    roles.forEach(item => {
                        db.execute(
                            `insert into groups_roles (group_id, role_id) values (?,?)`, 
                            [group.insertId, item]
                        )
                    })
                }
                return res.status(200).json({
                    st: 1,
                    msg: "Create new group successfully!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateGroup: async (req, res) => {
        try {
            const { id } = req.query
            const { title, description, roles } = req.body

            if(!title || !description || !roles) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // update value to groups table
            const [updateGroup] = await db.execute(
                `update my_store.groups set title = ?, description = ? where id = ?`, 
                [title, description, id]
            )

            if(updateGroup) {
                // Get role_id from group_roles table by group_id
                const [rolesId] = await db.execute(
                    `select groups_roles.role_id from groups_roles 
                    where groups_roles.group_id = ?`, 
                    [id]
                )

                const currentRoles = rolesId.map(item => String(item.role_id))
    
                // Add value not exist to group_roles table
                if(roles.length > 0) {
                    roles.forEach(item => {
                        const check = currentRoles.includes(item)
                        if(!check) {
                            db.execute(
                                `insert into groups_roles (group_id, role_id) values (?,?)`,
                                [id, item]
                            )
                        }
                    })
                }
                // Remove value changed to group_roles table
                if(currentRoles.length > 0) {
                    currentRoles.forEach(item => {
                        const check = roles.includes(item)
                        if(!check) {
                            db.execute(
                                `delete from groups_roles where group_id = ? and role_id = ?`, 
                                [id, item]
                            )
                        }
                    })
                }
    
                return res.status(200).json({
                    st: 1,
                    msg: "Update group successfully!",
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Update group failed!",
                })
            }

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteGroup: async (req, res) => {
        try {
            const { id } = req.query

            if(!id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [results] = await db.execute(
                `delete from my_store.groups where id = ?`, 
                [id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete group successfully!",
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Delete group failed!",
                })
            }

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

module.exports = groupController