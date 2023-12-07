const db = require("../model/db")
const cloudinary = require("../configs/cloudinary")
require("dotenv").config()

const productController = {
    getProducts: async (req, res) => {
        try {
            const { categoryId, search } = req.query

            let sql = `select products.*, category.label as category_name 
                from products
                left join category on products.category_id = category.id
                where products.id > 0`

            if(categoryId) {
                sql += ` and products.category_id = ${categoryId}`
            }

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and (products.title like "%${newSearch}%" 
                or products.id like "%${newSearch}%")`
            }

            const [products] = await db.execute(sql)

            if(products.length >= 0) {
                const results = await productController.getVariantsWithAttributes(products)
                if (results.length >= 0) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Get products successfully!",
                        data: results
                    })
                } else {
                    return res.status(200).json({
                        st: 0,
                        msg: "Get products failed!",
                        data: []
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

    getVariantsWithAttributes: async (products) => {
        let results = []
        for (let index = 0; index < products.length; index++) {
            let [variants] = await db.execute(
                `select * from variants where product_id = ?`,
                [products[index].id]
            )
            let newVariants = []
            for (let j = 0; j < variants.length; j++) {
                const [colors] = await db.execute(
                    `select * from variants_colors where variants_id = ${variants[j].id}`
                )
                newVariants.push({ ...variants[j], colors: colors})
            }

            let [attributes] = await db.execute(
                `select attributes.title as attributes_name, attributes_values.*
                    from products_attributes
                    left join attributes_values on products_attributes.value_id = attributes_values.id
                    left join attributes on attributes_values.attributes_id = attributes.id
                    where products_attributes.product_id = ?`,
                [products[index].id]
            )

            results.push({ ...products[index], variants: newVariants, attributes: attributes })
        }
        return results
    },

    createProudct: async (req, res) => {
        try {
            // console.log(req.body.ram.split(","));
            // console.log(req.body);
            // console.log(req.files);

            const { title, slug, category_id, brand_id, cpu, ram, display, graphics, storage } = req.body
            
            let attributes = []
            if (cpu) {
                attributes.push(...cpu.split(","))
            }
            if(ram) {
                attributes.push(...ram.split(","))
            }
            if(display) {
                attributes.push(...display.split(","))
            }
            if(graphics) {
                attributes.push(...graphics.split(","))
            }
            if(storage) {
                attributes.push(...storage.split(","))
            }

            if (req.files.length === 0) {
                return res.status(200).json({
                    st: 0,
                    msg: "Upload images failed or no images!"
                })
            }

            // Upload thumbnail
            const thumbnail = req.files.find(item => item.fieldname === "thumbnail")
            const upThumb = await cloudinary.uploader.upload(thumbnail.path,
                { folder: "cuahangdientu", allowedFormats: ['jpg', 'png', 'jpeg'], }
            )
            // Upload images
            const images = req.files.filter(item => item.fieldname === "images")
            let upImages = []
            for (let image of images) {
                const results = await cloudinary.uploader.upload(image.path,
                    { folder: "cuahangdientu", allowedFormats: ['jpg', 'png', 'jpeg'], }
                )
                upImages.push({
                    url: results.secure_url,
                    publicId: results.public_id
                })
            }

            // Insert products
            const [createProduct] = await db.execute(
                `insert into products (title, slug, category_id, brand_id, thumbnail, thumbname) 
                values (?,?,?,?,?,?)`, 
                [title, slug, category_id, brand_id, upThumb.secure_url, upThumb.public_id]
            )

            if (createProduct) {
                // Insert products_attributes
                attributes.forEach(item => {
                    db.execute(
                        `insert into products_attributes (product_id, value_id) 
                        values (?,?)`, 
                        [createProduct.insertId, Number(item)]
                    )
                })
                // Insert images
                upImages.forEach(item => {
                    db.execute(`insert into images (product_id, url, title) 
                        values (?,?,?)`,
                        [createProduct.insertId, item.url, item.publicId]
                    )
                })

                return res.status(200).json({
                    st: 1,
                    msg: "Create product successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Create product failed!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateProudct: async (req, res) => {
        try {
            // console.log(req.body);
            const { id } = req.query
            const { title, slug, brand_id, cpu, ram, display, graphics, storage, thumbname } = req.body
            
            // Create attributes value array
            let attributes = []
            if (cpu) {
                attributes.push(...cpu.split(","))
            }
            if(ram) {
                attributes.push(...ram.split(","))
            }
            if(display) {
                attributes.push(...display.split(","))
            }
            if(graphics) {
                attributes.push(...graphics.split(","))
            }
            if(storage) {
                attributes.push(...storage.split(","))
            }

            // Check attributes value changed
            const [productAttributesValue] = await db.execute(
                `select products_attributes.value_id from products_attributes 
                where product_id = ?`, 
                [id]
            )
            if (productAttributesValue.length > 0) {
                // Insert new attributes value
                const newProductAttributesValue = productAttributesValue.map(item => String(item.value_id))
                attributes.forEach(item => {
                    const check = newProductAttributesValue.includes(item)
                    if (!check) {
                        db.execute(
                            `insert into products_attributes (product_id, value_id) 
                            values (?,?)`, 
                            [id, Number(item)]
                        )
                    }
                })
                // Remove attributes value doesn't exist
                newProductAttributesValue.forEach(item => {
                    const check = attributes.includes(item)
                    if (!check) {
                        db.execute(
                            `delete from products_attributes where product_id = ? and 
                            value_id = ?`, [id, Number(item)]
                        )
                    }
                })
            }

            if (req.files.length > 0) {
                // Remove old cloudinary
                const removeOldThumb = await cloudinary.uploader.destroy(thumbname)
                if (removeOldThumb) {
                    // Upload new cloudinary
                    const thumbnail = req.files.find(item => item.fieldname === "thumbnail")
                    const upThumb = await cloudinary.uploader.upload(thumbnail.path,
                        { folder: "cuahangdientu", allowedFormats: ['jpg', 'png', 'jpeg'], }
                    )
                    // Update product
                    const [results] = await db.execute(
                        `update products 
                        set title = ?, slug = ?, brand_id = ?, thumbnail = ?, thumbname = ?, updatedAt = now() where id = ?`, 
                        [title, slug, brand_id, upThumb.secure_url, upThumb.public_id, id]
                    )

                    if (results) {
                        return res.status(200).json({
                            st: 1,
                            msg: "Update product successfully!"
                        })
                    } else {
                        return res.status(200).json({
                            st: 0,
                            msg: "Update product failed!"
                        })
                    }
                }
            } else {
                // Update product
                const [results] = await db.execute(
                    `update products set title = ?, slug = ?, brand_id = ?, updatedAt = now() where id = ?`, 
                    [title, slug, brand_id, id]
                )

                if (results) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Update product successfully!"
                    })
                } else {
                    return res.status(200).json({
                        st: 0,
                        msg: "Update product failed!"
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

    deleteProudct: async (req, res) => {
        try {
            // Validation
            if (!req.query.id || !req.query.thumbname) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            const [images] = await db.execute(
                `select * from images where product_id = ?`, 
                [req.query.id]
            )
            // Remove images from cloudinary
            if (images.length > 0) {
                for (let index = 0; index < images.length; index++) {
                    const removeImages = await cloudinary.uploader.destroy(images[index].title)
                    if (!removeImages) {
                        return res.status(200).json({
                            st: 0,
                            msg: "Delete product failed!"
                        })
                    }
                }
            }
            // Remove thumbnail from cloudinary
            const removeThumb =  await cloudinary.uploader.destroy(req.query.thumbname)
            if (!removeThumb) {
                return res.status(200).json({
                    st: 0,
                    msg: "Delete product failed!"
                })
            }

            const [results] = await db.execute(
                `delete from products where id = ?`, 
                [req.query.id]
            )

            if (results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete product successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Delete product failed!"
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

module.exports = productController