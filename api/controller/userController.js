const db = require("../model/db")
const bcrypt = require('bcrypt')
require("dotenv").config()

const userController = {
    getUsers: async (req, res) => {
        try {
            const { groupId, search } = req.query

            let sql = `select users.*, my_store.groups.title as group_name 
            from users 
            left join my_store.groups on users.group_id = my_store.groups.id
            where users.id > 0`

            if(groupId) {
                sql += ` and users.group_id = ${groupId}`
            }

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and (users.username like "%${newSearch}%" 
                or users.email like "%${newSearch}%"
                or users.phone like "%${newSearch}%")`
            }

            sql += ` order by users.group_id asc`
            
            const [users] = await db.execute(sql)

            const results = users.map(item => {
                const {password, ...others} = item
                return others
            })
            
            return res.status(200).json({
                st: 1,
                msg: "Get users successfully!",
                data: results
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
            if (!username || !email || !phone || !password) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing user info!"
                })
            }

            // Check name/email/phone/password are exist
            const [checkExist] = await db.execute(
                `select * from users where username = ? OR email = ? OR phone = ?`, 
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
            const [results] = await db.execute(
                `insert into users (username, email, phone, address, password, group_id) 
                values(?,?,?,?,?,?)`, 
                [username, email, phone, address, hashPassword, group_id]
            )
            if (results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Register user successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Register user failed!"
                })
            }
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
            if (!username || !email || !phone) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Check name/email/phone/password are exist
            const [checkExist] = await db.execute(
                `select * from users 
                where not id = ? and (username = ? OR email = ? OR phone = ?)`, 
                [id, username, email, phone]
            )
            const user = checkExist[0]
            if (user && username === user.username) {
                return res.status(200).json({
                    st: 0,
                    msg: "Tên người dùng đã tồn tại!"
                })
            }
            if (user && email === user.email) {
                return res.status(200).json({
                    st: 0,
                    msg: "Email đã tồn tại!"
                })
            }
            if (user && phone === user.phone) {
                return res.status(200).json({
                    st: 0,
                    msg: "Số điện thoại đã tồn tại!"
                })
            }
            if (password && password.length < 8) {
                return res.status(200).json({
                    st: 0,
                    msg: "Mật khẩu phải dài hơn 8 ký tự!"
                })
            }

            // Update user
            if (password) {
                // Hash password
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)
                const [results] = await db.execute(
                    `update users set username = ?, email = ?, phone = ?, address = ?, 
                    password = ?, group_id = ? where id = ?`, 
                    [username, email, phone, address, hashPassword, group_id, id]
                )
                if (results) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Update user successfully!"
                    })
                } else {
                    return res.status(200).json({
                        st: 0,
                        msg: "Update user failed!"
                    })
                }
            } else {
                const [results] = await db.execute(
                    `update users set username = ?, email = ?, phone = ?, address = ?, 
                    group_id = ? where id = ?`, 
                    [username, email, phone, address, group_id, id]
                )
                if (results) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Update user successfully!"
                    })
                } else {
                    return res.status(200).json({
                        st: 0,
                        msg: "Update user failed!"
                    })
                }
            }
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
            const [results] = await db.execute(
                `delete from users where id = ?`, 
                [id]
            )
            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete user successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Delete user failed!"
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

module.exports = userController