import db from "../models/db"
import bcrypt from "bcrypt"
import { createJwt } from "../config/jwtConfig"
require("dotenv").config()

const dbName = process.env.DB_DATABASE_NAME

const authController = {
    handleRegister: async (req, res) => {
        try {
            const { username, email, phone, address, password } = req.body

            // validations
            if (!username || !email || !phone || !password) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
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
            const [results] = await db.execute(
                `insert into user (username, email, phone, address, password) 
                values(?,?,?,?,?)`, 
                [username, email, phone, address, hashPassword]
            )

            if (results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Register user successfully!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getGroupRole: async(user) => {
        const [groupName] = await db.execute(
            `select * from ${dbName}.group where id = ?`, 
            [user.group_id])

        const [roles] = await db.execute(
            `select role.id, role.url from group_role
            inner join role on group_role.role_id = role.id
            where group_role.group_id = ?`, 
            [user.group_id])
        
        const data = {...groupName[0], roles: roles}

        return data
    },

    handleLogin: async (req, res) => {
        try {
            // Validate req body
            const username = req.body.username ? req.body.username : ""
            const email = req.body.email ? req.body.email : ""

            // Get User
            const [results] = await db.execute(
                `select * from user where username = ? OR email = ?`, 
                [username, email]
            )

            const user = results[0]

            if(!user) {
                return res.status(200).json({
                    st: 0,
                    msg: "Wrong username or password!"
                })
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if(!validPassword) {
                return res.status(200).json({
                    st: 0, 
                    msg: "Wrong username or password!"
                })
            }

            if(user && validPassword) {
                const groupWithRoles = await authController.getGroupRole(user)
                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    groupWithRoles,
                }
                // create token
                const token = createJwt(payload, process.env.JWT_ACCESS_KEY, "1d")
                // set token to cookie
                await res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                })

                const { password, group_id, ...others } = user
                return res.status(200).json({
                    st: 1, 
                    msg:"Login Successfully",
                    data: {...others, groupWithRoles: groupWithRoles}
                })
            }

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    handleLogout: async(req,res) => {
        res.clearCookie("jwt")
        return res.status(200).json({
            st: 1,
            msg: "Logged out!"
        })
    },

    updateAccount: async (req, res) => {
        try {
            const { id } = req.query
            const { username, email, phone, address, oldPassword, newPassword } = req.body

            // validations
            if (!username || !email || !phone) {
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
            if (newPassword && newPassword.length < 8) {
                return res.status(200).json({
                    st: 0,
                    msg: "Mật khẩu phải dài hơn 8 ký tự!"
                })
            }

            // Update user
            if (newPassword) {
                // Check old password
                const [oldUser] = await db.execute(
                    `select * from user where id = ?`,
                    [id]
                )

                const validPassword = await bcrypt.compare(oldPassword, oldUser[0].password)
                if(!validPassword) {
                    return res.status(200).json({
                        st: 0, 
                        msg: "Wrong password!"
                    })
                }

                // Hash password
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(newPassword, salt)
                const [results] = await db.execute(
                    `update user set username = ?, email = ?, phone = ?, address = ?, 
                    password = ? where id = ?`, 
                    [username, email, phone, address, hashPassword, id]
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
                    `update users set username = ?, email = ?, phone = ?, address = ? 
                    where id = ?`, 
                    [username, email, phone, address, id]
                )
                if (results) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Update user successfully!"
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

    getUpdateAccount: async (req, res) => {
        try {
            const { id } = req.query

            const [results] = await db.execute(
                `select * from user where id = ?`, 
                [id]
            )

            const user = results[0]

            const groupWithRoles = await authController.getGroupRole(user)
            const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                groupWithRoles,
            }
            // create token
            const token = createJwt(payload, process.env.JWT_ACCESS_KEY, 60000)
            // set token to cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            })

            const { password, group_id, ...others } = user
            return res.status(200).json({
                st: 1, 
                msg:"Login Successfully",
                data: {...others, groupWithRoles: groupWithRoles}
            })
        } catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    }
}

export default authController