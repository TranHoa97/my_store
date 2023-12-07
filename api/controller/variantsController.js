const db = require("../model/db")
const bcrypt = require('bcrypt')
require("dotenv").config()

const variantsController = {
    getVariants: async (req, res) => {
        try {
            const { productId } = req.query
            
            if(productId) {
                const colors = await variantsController.getColors(productId)

                const [results] = await db.execute(
                    `select products.thumbnail, variants.* from products
                    left join variants on products.id = variants.product_id
                    where variants.product_id = ?`, 
                    [productId]
                )
    
                if (results.length >= 0) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Get variants successfully!",
                        data: results.map(item => {
                            const validColor = colors.filter(e => e.variants_id === item.id)
                            return { ...item, colors: validColor }
                        })
                    })
                } else {
                    return res.status(200).json({
                        st: 0,
                        msg: "No data!",
                    })
                }
            }

            if(!productId) {
                const [results] = await db.execute(
                    `select variants.*, variants_colors.title as color 
                    from variants
                    left join variants_colors on variants.id = variants_colors.variants_id`
                )
                if (results.length > 0) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Get variants successfully!",
                        data: results
                    })
                } else {
                    return res.status(200).json({
                        st: 0,
                        msg: "No data!"
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

    getColors: async(id) => {
        const [colors] = await db.execute(
            `select variants_colors.* from variants_colors 
            left join variants on variants_colors.variants_id = variants.id 
            where variants.product_id = ?`, 
            [id]
        )

        return colors
    },

    createVariants: async (req, res) => {
        try {
            const { title, slug, price, quantity, sold, description, ram, storage, colors, product_id, cpu, display, graphics, weight } = req.body

            const sql = `insert into variants 
            (product_id, ram, storage, title, price, quantity, sold, description, slug, cpu, display, graphics, weight) 
            values (?,?,?,?,?,?,?,?,?,?,?,?,?)`

            const [addVariants] = await db.execute(
                sql, 
                [product_id, ram, storage, title, price, quantity, sold, description, slug,cpu || "", display || "", graphics || "", weight || ""]
            )

            if (addVariants && colors) {
                colors.forEach(item => {
                    db.execute(
                        `insert into variants_colors (variants_id, title) values (?,?)`, 
                        [addVariants.insertId, item]
                    )
                })
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

            const [udVariants] = await db.execute(
                `update variants 
                set title = ?, slug = ?, price = ?, quantity = ?, sold = ?, description = ?, ram = ?, storage = ?, cpu = ?, display = ?, graphics = ?, weight= ? where id = ?`, 
                [title, slug, price, quantity, sold, description, ram, storage, cpu || "", display || "", graphics || "", weight || "", id]
            )

            const [colorsVariants] = await db.execute(
                `select variants_colors.title from variants_colors where variants_id = ?`, 
                [id]
            )

            const arr = colorsVariants.map(item => item.title)
            if (colors && colors.length > 0) {
                colors.forEach(item => {
                    const check = arr.includes(item)
                    if (!check) {
                        db.execute(
                            `insert into variants_colors (variants_id, title) values (?,?)`, 
                            [id, item]
                        )
                    }
                })
            }

            if (arr.length > 0) {
                if (colors === undefined) {
                    db.execute(
                        `delete from variants_colors where variants_id = ?`,
                        [id]
                    )
                } else {
                    arr.forEach(item => {
                        const check = colors.includes(item)
                        if (!check) {
                            db.execute(
                                `delete from variants_colors where variants_id = ? and title = ?`, 
                                [id, item]
                            )
                        }
                    })
                }
            }

            return res.status(200).json({
                st: 1,
                msg: "Update variants successfully!",
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteVariants: async (req, res) => {
        try {
            const { id } = req.query

            const results = await db.execute(
                `delete from variants where id = ?`, 
                [id]
            )

            if (results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete variants successfully!",
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

module.exports = variantsController