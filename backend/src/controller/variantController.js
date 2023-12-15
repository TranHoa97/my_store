import db from "../models/db"
require("dotenv").config()

const variantsController = {
    getVariants: async (req, res) => {
        try {
            const { productId } = req.query

            if (productId) {
                let sql = `select
                variant.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        "id", color.id,
                        "label", color.label
                    )
                ) as colors
                from variant
                left join color on color.variant_id = variant.id
                where variant.product_id = ?
                group by variant.id`

                const [variants] = await db.execute(sql, [productId])

                return res.status(200).json({
                    st: 1,
                    msg: "Get variants successfully!",
                    data: variants.length > 0 ? variants : []
                })
            }

            let sql = `select
            variant.*,
            color.label as color
            from variant
            left join color on color.variant_id = variant.id`

            const [variants] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get variants successfully!",
                data: variants.length > 0 ? variants : []
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createVariants: async (req, res) => {
        try {
            const { title, slug, price, quantity, sold, description, ram, storage, colors, product_id, cpu, display, graphics, weight } = req.body

            const sql = `insert into variant
            (product_id, ram, storage, title, price, quantity, sold, 
            description, slug, cpu, display, graphics, weight) 
            values (?,?,?,?,?,?,?,?,?,?,?,?,?)`

            // Insert variant
            const [insertVariant] = await db.execute(
                sql,
                [product_id, ram, storage, title, price, quantity, sold, description, slug, cpu || "", display || "", graphics || "", weight || ""]
            )

            // Insert colors
            if (colors && colors.length > 0) {
                const newColors = colors.map(item => `(${insertVariant.insertId}, "${item}")`)
                await db.execute(
                    `insert into color (variant_id, label) values ${newColors.toString()}`
                )
            }

            return res.status(200).json({
                st: 1,
                msg: "Create variants successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateVariants: async (req, res) => {
        try {
            const { id } = req.query
            const { title, slug, price, quantity, sold, description, ram, storage, colors, cpu, display, graphics, weight } = req.body

            // Update variant
            await db.execute(
                `update variant
                set title = ?, slug = ?, price = ?, quantity = ?, sold = ?, description = ?, 
                ram = ?, storage = ?, cpu = ?, display = ?, graphics = ?, weight= ? 
                where id = ?`,
                [title, slug, price, quantity, sold, description, ram, storage, cpu || "", display || "", graphics || "", weight || "", id]
            )

            // Update colors
            if (colors && colors.length > 0) {
                // Remove old color
                await db.execute(
                    `delete from color where variant_id = ${id}`
                )
                // Insert new color
                const newColors = colors.map(item => `(${id}, "${item}")`)
                await db.execute(
                    `insert into color (variant_id, label) values ${newColors.toString()}`
                )
            }

            return res.status(200).json({
                st: 1,
                msg: "Update variants successfully!",
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteVariants: async (req, res) => {
        try {
            const { id } = req.query

            // Validation
            if (!id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!",
                })
            }

            // Delete variant
            await db.execute(
                `delete from variant where id = ${id}`
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete variants successfully!",
            })
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default variantsController