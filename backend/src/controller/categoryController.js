import db from "../models/db"
require("dotenv").config()

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const sql = `select * from category order by id asc`

            const [category] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get category successfully!",
                data: category.length > 0 ? category : []
            })
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

            // Validation
            if(!label || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Insert category
            await db.execute(
                `insert into category (label, slug) values (?,?)`, 
                [label, slug]
            )

            return res.status(200).json({
                st: 1,
                msg: "Create new category successfully!"
            })
            
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
            
            // Validation
            if(!id || !label || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Update category
            await db.execute(
                `update category set label = ?, slug = ? where id = ?`, 
                [label, slug, id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Update category successfully!"
            })

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

            // Validation
            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            // Delete category
            await db.execute(
                `delete from category where id = ?`, 
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete category successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default categoryController