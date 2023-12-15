import db from "../models/db"
require("dotenv").config()

const attributesController = {
    // Attributes
    getAttributes: async (req, res) => {
        try {
            const { category, search } = req.query

            let sql = `select 
            attribute.id,
            attribute.label,
            attribute.category_id,
            category.label as category_label,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    "id", attribute_value.id,
                    "label", attribute_value.label,
                    "slug", attribute_value.slug
                )
            ) as data
            from attribute
            left join category on attribute.category_id = category.id
            left join attribute_value on attribute.id = attribute_value.attribute_id
            where attribute.id is not null`

            if(category) {
                sql += ` and attribute.category_id = ${category}`
            }

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and attribute.label like "%${newSearch}%"`
            }

            sql += ` group by attribute.id 
                    order by attribute.category_id asc`

            const [attributes] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get attributes successfully!",
                data: attributes.length > 0 ? attributes : []
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createAttributes: async (req, res) => {
        try {
            const { title, category_id } = req.body

            if(!title || !category_id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            await db.execute(
                `insert into attribute (label, category_id) values (?,?)`, 
                [title, category_id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Create attributes successfully!"
            })

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

            // Validation
            if(!id || !title || !category_id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            await db.execute(
                `update attribute set label = ?, category_id = ? where id = ?`, 
                [title, category_id, id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Update attributes successfully!"
            })

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

            // Validation
            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            await db.execute(
                `delete from attribute where id = ?`, 
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete attributes successfully!"
            })

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
                `select 
                attribute.label as attribute, 
                category.label as category,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        "id", attribute_value.id,
                        "label", attribute_value.label,
                        "slug", attribute_value.slug
                    )
                ) as data
                from attribute
                left join category on attribute.category_id = category.id
                left join attribute_value on attribute.id = attribute_value.attribute_id
                where attribute.id = ?
                group by attribute.id`, 
                [id]
            )

            const newData = value[0].data.filter(item => item.id !== null)

            return res.status(200).json({
                st: 1,
                msg: "Get attributes successfully!",
                data: value.length > 0 ? {...value[0], data: newData} : []
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

            // Validation
            if(!attributes_id || !title || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }
            
            await db.execute(
                `insert into attribute_value (attribute_id, label, slug) 
                values (?,?,?)`, 
                [attributes_id, title, slug]
            )
            
            return res.status(200).json({
                    st: 1,
                    msg: "Create attributes value successfully!"
                })

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

            // Validation
            if(!id || !title || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            await db.execute(
                `update attribute_value set label = ?, slug = ? where id = ?`, 
                [title, slug, id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Update attributes value successfully!"
            })

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

            // Validation
            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            await db.execute(
                `delete from attribute_value where id = ?`, 
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete attributes value successfully!"
            })
            
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default attributesController