const db = require("../model/db")
require("dotenv").config()

const brandController = {
    getBrands: async (req, res) => {
        try {
            const { categoryId, search } = req.query

            let sql = `select brand.*, category.label as category from brand 
            left join category on brand.category_id = category.id
            where brand.id > 0`
            
            if(categoryId) {
                sql += ` and brand.category_id = ${categoryId}`
            }

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and brand.label like "%${newSearch}%"`
            }

            sql += ` order by brand.category_id asc`

            const [brands] = await db.execute(sql)

            if(brands.length >= 0) {
                return res.status(200).json({
                    st: 1,
                    msg: "Get brand successfully!",
                    data: brands
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Get brand failed!",
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

    createBrand: async(req, res) => {
        try {
            const { label, slug, category_id } = req.body

            if(!label || !slug || !category_id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [results] = await db.execute(
                `insert into brand (label, slug, category_id) values (?,?,?)`, 
                [label, slug, category_id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Create new brand successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Create new brand failed!"
                })
            }
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
            
            if(!id || !label || !slug || !category_id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [results] = await db.execute(
                `update Brand set label = ?, slug = ?, category_id = ? where id = ?`, 
                [label, slug, category_id, id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Update brand successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Update brand failed!"
                })
            }
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

            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            const [results] = await db.execute(
                `delete from brand where id = ?`, 
                [id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete brand successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Delete brand failed!"
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

module.exports = brandController