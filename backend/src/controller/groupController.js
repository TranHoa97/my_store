import db from "../models/db"
require("dotenv").config()

const dbName = process.env.DB_DATABASE_NAME

const groupController = {
    getGroups: async (req, res) => {
        try {
            const { page, limit, search } = req.query

            let sql = `select 
                ${dbName}.group.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        "id", role.id,
                        "url", role.url,
                        "description", role.description
                    )
                ) as roles
                from ${dbName}.group
                left join group_role on ${dbName}.group.id = group_role.group_id
                left join role on role.id = group_role.role_id
                where ${dbName}.group.id is not null
            `
            let sqlTotal = `select count(*) as count from ${dbName}.group where id is not null`

            if (search) {
                sql += ` and (${dbName}.group.label like "%${search}%" 
                or ${dbName}.group.id like "%${search}%")`

                sqlTotal += ` and (${dbName}.group.label like "%${search}%" 
                or ${dbName}.group.id like "%${search}%")`
            }

            sql += ` group by ${dbName}.group.id`

            if(limit) {
                sql += ` limit ${limit}`
            }

            if(page) {
                const offset = (page - 1) * limit
                sql += ` offset ${offset}`
            }

            const [groups] = await db.execute(sql)

            const [totalGroup] = await db.execute(sqlTotal)

            return res.status(200).json({
                st: 1,
                msg: "Get groups successfully!",
                data: {
                    data: groups.length > 0 ? groups : [],
                    pagination: {
                        page: +page,
                        limit: +limit,
                        total: +(totalGroup[0]?.count)
                    }
                }
            })
            
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createGroup: async (req, res) => {
        try {
            const { title, description } = req.body
            const roles = req.body.roles ? req.body.roles : []

            // validation
            if (!title || !description) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // insert value to groups table
            const [insertGroup] = await db.execute(
                `insert into ${dbName}.group (label, description) values (?,?)`,
                [title, description]
            )

            // insert value to group_role table
            if (roles.length > 0) {
                let newRoles = roles.map(item => `(${insertGroup.insertId},${item})`)
                await db.execute(
                    `insert into group_role (group_id, role_id) values ${newRoles.toString()}`
                )
            }

            return res.status(200).json({
                st: 1,
                msg: "Create new group successfully!"
            })

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
            const { title, description } = req.body
            const roles = req.body.roles ? req.body.roles : []

            // Validation
            if (!title || !description) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // update value to groups table
            await db.execute(
                `update ${dbName}.group set label = ?, description = ? where id = ?`,
                [title, description, id]
            )

            // Get role_id from group_roles table by group_id
            const [rolesId] = await db.execute(
                `select role_id from group_role where group_role.group_id = ?`,
                [id]
            )
            const currentRoles = rolesId.map(item => String(item.role_id))

            // Add value not exist to group_role table
            if (roles.length > 0) {
                let arr = []
                roles.forEach(item => {
                    const check = currentRoles.includes(item)
                    if (!check) {
                        arr.push(item)
                    }
                })
                if (arr.length > 0) {
                    let newArr = arr.map(item => {
                        return `(${id},${item})`
                    })
                    await db.execute(
                        `insert into group_role (group_id, role_id) values ${newArr.toString()}`
                    )
                }
            }

            // Remove value changed from group_role table
            if (currentRoles.length > 0) {
                let arr = []
                currentRoles.forEach(item => {
                    const check = roles.includes(item)
                    if (!check) {
                        arr.push(item)
                    }
                })
                if (arr.length > 0) {
                    let newArr = arr.map(item => {
                        return `(${id},${item})`
                    })
                    await db.execute(
                        `delete from group_role where (group_id,role_id) in (${newArr.toString()})`
                    )
                }
            }

            return res.status(200).json({
                st: 1,
                msg: "Update group successfully!",
            })

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

            // Validation
            if (!id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Delete group
            await db.execute(
                `delete from ${dbName}.group where id = ?`,
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete group successfully!",
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default groupController