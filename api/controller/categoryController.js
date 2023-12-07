const db = require("../model/db")
require("dotenv").config()

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const sql = `select * from category order by id asc`

            const [category] = await db.execute(sql)

            if (category.length > 0) {
                return res.status(200).json({
                    st: 1,
                    msg: "Get category successfully!",
                    data: category
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Get category failed!",
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

    createCategory: async(req, res) => {
        try {
            // console.log(req.body);
            const { label, slug } = req.body

            if(!label || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [results] = await db.execute(
                `insert into category (label, slug) values (?,?)`, 
                [label, slug]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Create new category successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Create new category failed!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateCategory: async(req, res) => {
        try {
            const { id } = req.query
            const { label, slug } = req.body
            
            if(!id || !label || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [results] = await db.execute(
                `update category set label = ?, slug = ? where id = ?`, 
                [label, slug, id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Update category successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Update category failed!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteCategory: async(req, res) => {
        try {
            const { id } = req.query

            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            const [results] = await db.execute(
                `delete from category where id = ?`, 
                [id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete category successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Delete category failed!"
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

module.exports = categoryController