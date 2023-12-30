import db from "../models/db"
require("dotenv").config()

const attributesController = {
    // Attributes
    getAttributes: async (req, res) => {
        try {
            const { category, search, page, limit } = req.query

            let sql = `select 
            attribute.*,
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
            left join attribute_value on attribute_value.attribute_id = attribute.id
            where attribute.id is not null`

            let sqlTotal = `select count(*) as count from attribute where id is not null`

            if(category) {
                sql += ` and attribute.category_id = ${category}`
                sqlTotal += ` and attribute.category_id = ${category}`
            }

            if(search) {
                sql += ` and (attribute.label like "%${search}%"
                or attribute.id like "%${search}%"
                or attribute.slug like "%${search}%")`

                sqlTotal += ` and (attribute.label like "%${search}%"
                or attribute.id like "%${search}%"
                or attribute.slug like "%${search}%")`
            }

            sql += ` group by attribute.id order by attribute.category_id asc`

            if(limit) {
                sql += ` limit ${limit}`
            }

            if(page) {
                const offset = (page - 1) * limit
                sql += ` offset ${offset}`
            }

            const [attributes] = await db.execute(sql)

            const [totalAttribute] = await db.execute(sqlTotal)

            return res.status(200).json({
                st: 1,
                msg: "Get attributes successfully!",
                data: {
                    data: attributes.length > 0 ? attributes : [],
                    pagination: {
                        page: +page,
                        limit: +limit,
                        total: +(totalAttribute[0]?.count),
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

    createAttributes: async (req, res) => {
        try {
            const { title, category_id, slug } = req.body

            // validation
            if(!title || !category_id || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // insert
            await db.execute(
                `insert into attribute (label, category_id, slug) values (?,?,?)`, 
                [title, category_id, slug]
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
            const { title, category_id, slug } = req.body

            // validation
            if(!id || !title || !category_id || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // update
            await db.execute(
                `update attribute set label = ?, category_id = ?, slug = ? where id = ?`, 
                [title, category_id, slug, id]
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

            // validation
            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            // delete
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

            // validation
            if(!attributes_id || !title || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }
            
            // insert
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

            // validation
            if(!id || !title || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // update
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

            // validation
            if(!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // delete
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