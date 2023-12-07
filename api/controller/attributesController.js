const db = require("../model/db")
const bcrypt = require('bcrypt')
require("dotenv").config()

const attributesController = {
    // Attributes
    getAttributes: async (req, res) => {
        try {
            const { categoryId, search } = req.query

            let sql = `select attributes.*, category.label as category_name 
            from attributes
            left join category on attributes.category_id = category.id
            where attributes.id > 0`

            if(categoryId) {
                sql += ` and category_id = ${categoryId}`
            }

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and attributes.title like "%${newSearch}%"`
            }

            sql += ` order by attributes.category_id asc`

            const [attributes] = await db.execute(sql)

            const results = await attributesController.getValue(attributes)

            return res.status(200).json({
                st: 1,
                msg: "Get attributes successfully!",
                data: results
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getValue: async(attributes) => {
        let results = []
        for (let index = 0; index < attributes.length; index++) {
            const [value] = await db.execute(
                `select * from attributes_values where attributes_id = ?`,
                [attributes[index].id]
            )
            results.push({
                ...attributes[index],
                data: value
            })
        }
        return results
    },

    createAttributes: async (req, res) => {
        try {
            const { title, category_id } = req.body

            const [results] = await db.execute(
                `insert into attributes (title, category_id) values (?,?)`, 
                [title, category_id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Create attributes successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Create attributes failed!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateAttributes: async (req, res) => {
        try {
            const { id } = req.query
            const { title, category_id } = req.body

            const [results] = await db.execute(
                `update attributes set title = ?, category_id = ? where id = ?`, 
                [title, category_id, id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Update attributes successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Update attributes failed!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteAttributes: async (req, res) => {
        try {
            const { id } = req.query

            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            const [results] = await db.execute(
                `delete from attributes where id = ?`, 
                [id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete attributes successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Delete attributes failed!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    // Attributes Value
    getAttributesValue: async (req, res) => {
        try {
            const { id } = req.query

            const [value] = await db.execute(
                `select * from attributes_values where attributes_id = ?`,
                [id]
            )

            const [attributes] = await db.execute(
                `select attributes.title as attributes, category.label as category 
                from attributes
                left join category on attributes.category_id = category.id
                where attributes.id = ?`, 
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Get attributes successfully!",
                data: {
                    attributes: attributes[0].attributes,
                    category: attributes[0].category,
                    data: value
                }
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createAttributesValue: async (req, res) => {
        try {
            const { attributes_id, title, slug } = req.body

            if(!attributes_id || !title || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }
            
            const [results] = await db.execute(
                `insert into attributes_values (attributes_id, title, slug) 
                values (?,?,?)`, 
                [attributes_id, title, slug]
            )
            
            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Create attributes value successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Create attributes value failed!"
                })
            }

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateAttributesValue: async (req, res) => {
        try {
            const { id } = req.query
            const { title, slug } = req.body

            if(!id || !title || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [results] = await db.execute(
                `update attributes_values set title = ?, slug = ? where id = ?`, 
                [title, slug, id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Update attributes value successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Update attributes value failed!"
                })
            }

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteAttributesValue: async (req, res) => {
        try {
            const { id } = req.query

            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [results] = await db.execute(
                `delete from attributes_values where id = ?`, 
                [id]
            )

            if(results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete attributes value successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Delete attributes value failed!"
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

module.exports = attributesController