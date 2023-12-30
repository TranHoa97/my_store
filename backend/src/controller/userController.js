import db from "../models/db"
import bcrypt from "bcrypt"
require("dotenv").config()
const dbName = process.env.DB_DATABASE_NAME

const userController = {
    getUsers: async (req, res) => {
        try {
            const { group, search, page, limit } = req.query

            let sql = `select 
            user.*, ${dbName}.group.label as group_name 
            from user
            left join ${dbName}.group on user.group_id = ${dbName}.group.id
            where user.id is not null`

            let sqlTotal = `select count(*) as count from user where id is not null`

            if(group) {
                sql += ` and user.group_id = ${group}`
                sqlTotal += ` and group_id= ${group}`
            }

            if(search) {
                sql += ` and (user.username like "%${search}%" 
                or user.email like "%${search}%"
                or user.phone like "%${search}%")`

                sqlTotal += ` and (user.username like "%${search}%" 
                or user.email like "%${search}%"
                or user.phone like "%${search}%")`
            }

            sql += ` order by user.id asc`

            if(limit) {
                sql += ` limit ${limit}`
            }

            if(page) {
                const offset = (page - 1) * limit
                sql += ` offset ${offset}`
            }
            
            const [users] = await db.execute(sql)

            const [totalUser] = await db.execute(sqlTotal)

            const results = users.map(item => {
                const {password, ...others} = item
                return others
            })
            
            return res.status(200).json({
                st: 1,
                msg: "Get users successfully!",
                data: {
                    data: results.length > 0 ? results : [],
                    pagination: {
                        page: +page,
                        limit: +limit,
                        total: +(totalUser[0]?.count),
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

    createUser: async (req, res) => {
        try {
            const { username, email, phone, address, password, group_id } = req.body

            // validations
            if (!username || !email || !phone || !password || !group_id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing user info!"
                })
            }

            // Check name/email/phone/password are exist
            const [checkExist] = await db.execute(
                `select * from user where username = ? OR email = ? OR phone = ?`, 
                [username, email, phone]
            )
            const user = checkExist[0]
            if (user && username === user.username) {
                return res.status(200).json({
                    st: 0,
                    msg: "Username is exist!"
                })
            }
            if (user && email === user.email) {
                return res.status(200).json({
                    st: 0,
                    msg: "Email is exist!"
                })
            }
            if (user && phone === user.phone) {
                return res.status(200).json({
                    st: 0,
                    msg: "Phone number is exist!"
                })
            }
            if (password.length < 8) {
                return res.status(200).json({
                    st: 0,
                    msg: "Password must 8 text!"
                })
            }

            // Hash password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            // Create new user
            await db.execute(
                `insert into user (username, email, phone, address, password, group_id) 
                values(?,?,?,?,?,?)`, 
                [username, email, phone, address, hashPassword, group_id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Create user successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.query
            const { username, email, phone, address, password, group_id } = req.body

            // validations
            if (!username || !email || !phone || !group_id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Check name/email/phone/password are exist
            const [checkExist] = await db.execute(
                `select * from user
                where not id = ? and (username = ? OR email = ? OR phone = ?)`, 
                [id, username, email, phone]
            )
            const user = checkExist[0]
            if (user && username === user.username) {
                return res.status(200).json({
                    st: 0,
                    msg: "Username is exist!"
                })
            }
            if (user && email === user.email) {
                return res.status(200).json({
                    st: 0,
                    msg: "Email is exist!"
                })
            }
            if (user && phone === user.phone) {
                return res.status(200).json({
                    st: 0,
                    msg: "Phone number is exist!"
                })
            }
            if (password && password.length < 8) {
                return res.status(200).json({
                    st: 0,
                    msg: "Password must 8 text or more!"
                })
            }

            // Update user
            if (password) {
                // Hash password
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)
                await db.execute(
                    `update user set username = ?, email = ?, phone = ?, address = ?, 
                    password = ?, group_id = ? where id = ?`, 
                    [username, email, phone, address, hashPassword, group_id, id]
                )
            } else {
                await db.execute(
                    `update user set username = ?, email = ?, phone = ?, address = ?, 
                    group_id = ? where id = ?`, 
                    [username, email, phone, address, group_id, id]
                )
            }
            
            return res.status(200).json({
                st: 1,
                msg: "Update user successfully!"
            })
            
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.query

            // Validation
            if(!id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Delete user
            await db.execute(
                `delete from user where id = ?`, 
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete user successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default userController