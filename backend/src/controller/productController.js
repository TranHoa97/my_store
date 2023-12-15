import db from "../models/db"
import cloudinary from "../config/cloudinary"
require("dotenv").config()

const productController = {
    getProducts: async (req, res) => {
        try {
            const { productId, categoryId, search } = req.query

            if(productId) {
                let sql = `select
                product.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        "id", attribute_value.id,
                        "label", attribute_value.label,
                        "slug", attribute_value.slug,
                        "attribute_id", attribute_value.attribute_id
                    )
                ) as attributes
                from product
                left join product_attribute on product_attribute.product_id = product.id
                left join attribute_value on attribute_value.id = product_attribute.value_id
                where product.id = ${productId}
                group by product.id`

                const [products] = await db.execute(sql)

                return res.status(200).json({
                    st: 1,
                    msg: "Get product successfully!",
                    data: products.length > 0 ? products[0] : {}
                })
            }

            let sql = `select 
                product.*, 
                category.label as category_name,
                count(variant.id) as total_variant
                from product
                left join category on product.category_id = category.id
                left join variant on variant.product_id = product.id
                where product.id is not null`

            if (categoryId) {
                sql += ` and product.category_id = ${categoryId}`
            }

            if (search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and (product.title like "%${newSearch}%" 
                or product.id like "%${newSearch}%")`
            }

            sql += ` group by product.id`

            const [products] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get products successfully!",
                data: products.length > 0 ?  products : []
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createProudct: async (req, res) => {
        try {
            const { title, slug, category_id, brand_id, attributes } = req.body

            // Validation
            if (!title || !slug || !category_id || !brand_id || !attributes) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }
            if (req.files.length === 0) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing files!"
                })
            }

            // Upload thumbnail
            const thumbnail = req.files.find(item => item.fieldname === "thumbnail")
            const upThumb = await cloudinary.uploader.upload(thumbnail.path,
                { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
            )
            // Upload images
            const images = req.files.filter(item => item.fieldname === "images")
            let upImages = []
            for (let image of images) {
                const results = await cloudinary.uploader.upload(image.path,
                    { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
                )
                upImages.push({
                    url: results.secure_url,
                    publicId: results.public_id
                })
            }

            // Insert product
            const [insertProduct] = await db.execute(
                `insert into product (title, slug, category_id, brand_id, thumbnail, thumbname) 
                values (?,?,?,?,?,?)`,
                [title, slug, category_id, brand_id, upThumb.secure_url, upThumb.public_id]
            )

            // Insert product_attribute
            const newAttributes = attributes.split(",").map(item => {
                return `(${insertProduct.insertId}, ${item})`
            })
            await db.execute(
                `insert into product_attribute (product_id, value_id) values ${newAttributes.toString()}`
            )

            // Insert image
            const newImages = upImages.map(item => {
                return `(${insertProduct.insertId}, "${item.url}", "${item.publicId}")`
            })
            await db.execute(
                `insert into image (product_id, url, title) values ${newImages.toString()}`
            )

            // Response
            return res.status(200).json({
                st: 1,
                msg: "Create new product successfully!"
            })

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
            const { title, slug, brand_id, thumbname, attributes } = req.body

            // Validation
            if (!id || !title || !slug || !brand_id || !attributes) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            if (req.files.length > 0) {
                // Remove old cloudinary
                await cloudinary.uploader.destroy(thumbname)
                // Upload new cloudinary
                const thumbnail = req.files.find(item => item.fieldname === "thumbnail")
                const upThumb = await cloudinary.uploader.upload(thumbnail.path,
                    { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
                )
                // Update product
                await db.execute(
                    `update product set title = ?, slug = ?, brand_id = ?, thumbnail = ?, 
                    thumbname = ? where id = ?`,
                    [title, slug, brand_id, upThumb.secure_url, upThumb.public_id, id]
                )
            } else {
                // Update product
                await db.execute(
                    `update product set title = ?, slug = ?, brand_id = ? where id = ?`,
                    [title, slug, brand_id, id]
                )
            }

            // Update attributes product
            const newAttributes = attributes.split(",").map(item => {
                return `(${id}, ${item})`
            })
            // Delete old value_id from product_attribute table
            await db.execute(
                `delete from product_attribute where product_id = ${id}`
            )
            // Insert new value_id from product_attribute table
            await db.execute(
                `insert into product_attribute (product_id, value_id)
                values ${newAttributes.toString()}`
            )

            return res.status(200).json({
                st: 1,
                msg: "Update product successfully!"
            })

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
                `select * from image where product_id = ?`,
                [req.query.id]
            )
            // Remove images from cloudinary
            if (images.length > 0) {
                for (let index = 0; index < images.length; index++) {
                    await cloudinary.uploader.destroy(images[index].title)
                }
            }
            // Remove thumbnail from cloudinary
            await cloudinary.uploader.destroy(req.query.thumbname)

            // Delete product
            await db.execute(
                `delete from product where id = ?`,
                [req.query.id]
            )

            // Response
            return res.status(200).json({
                st: 1,
                msg: "Delete product successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

}

export default productController