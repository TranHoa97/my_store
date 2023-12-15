import db from "../models/db"
require("dotenv").config()

const brandController = {
    getBrands: async (req, res) => {
        try {
            const { category, search } = req.query

            let sql = `select brand.*, category.label as category from brand 
            left join category on brand.category_id = category.id
            where brand.id > 0`
            
            if(category) {
                sql += ` and brand.category_id = ${category}`
            }

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and brand.label like "%${newSearch}%"`
            }

            sql += ` order by brand.category_id asc`

            const [brands] = await db.execute(sql)
            
            return res.status(200).json({
                st: 1,
                msg: "Get brand successfully!",
                data: brands.length > 0 ? brands : []
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createBrand: async(req, res) => {
        try {
            const { label, slug, category_id } = req.body

            // Validation
            if(!label || !slug || !category_id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Create brand
            await db.execute(
                `insert into brand (label, slug, category_id) values (?,?,?)`, 
                [label, slug, category_id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Create new brand successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateBrand: async(req, res) => {
        try {
            const { id } = req.query
            const { label, slug, category_id } = req.body
            
            // Validation
            if(!id || !label || !slug || !category_id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Update brand
            await db.execute(
                `update brand set label = ?, slug = ?, category_id = ? where id = ?`, 
                [label, slug, category_id, id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Update brand successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteBrand: async(req, res) => {
        try {
            const { id } = req.query

            // Validation
            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            // Delete brand
            await db.execute(
                `delete from brand where id = ?`, 
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete brand successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default brandController