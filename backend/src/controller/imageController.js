import db from "../models/db"
import cloudinary from "../config/cloudinary"
require("dotenv").config()

const imageController = {
    getImages: async (req, res) => {
        try {
            const { search, limit, page } = req.query

            let sql = `select 
            image.*, 
            product.title as product_name 
            from image
            left join product on image.product_id = product.id
            where image.id is not null
            `

            let sqlTotal = `select 
            count(*) as count 
            from image 
            left join product on image.product_id = product.id
            where image.id is not null
            `

            if (search) {
                sql += ` and (product.title like "%${search}%" 
                or product.id like "%${search}%"
                or product.slug like "%${search}%")`

                sqlTotal += ` and (product.title like "%${search}%" 
                or product.id like "%${search}%"
                or product.slug like "%${search}%")`
            }

            sql += ` order by image.product_id asc`

            if(limit) {
                sql += ` limit ${limit}`
            }

            if(page) {
                const offset = (page - 1) * limit
                sql += ` offset ${offset}`
            }

            // Get data
            const [images] = await db.execute(sql)

            const [totalImage] = await db.execute(sqlTotal)

            return res.status(200).json({
                st: 1,
                msg: "Get images successfully!",
                data: {
                    data: images.length > 0 ? images : [],
                    pagination: {
                        page: +(page),
                        limit: +(limit),
                        total: +(totalImage[0]?.count)
                    }
                }
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createImage: async (req, res) => {
        try {
            // Validations
            if (!req.files) {
                return res.status(200).json({
                    st: 1,
                    msg: "No files!"
                })
            }

            // Upload cloudinary
            const thumbnail = req.files[0]
            const upThumb = await cloudinary.uploader.upload(thumbnail.path,
                { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
            )

            // Insert database
            await db.execute(
                `insert into image (url, title, product_id) values (?,?,?)`,
                [upThumb.secure_url, upThumb.public_id, req.body.product_id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Create image successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateImage: async (req, res) => {
        try {
            const { imageId, oldImage } = req.query

            // Validations
            if (!req.files) {
                return res.status(200).json({
                    st: 1,
                    msg: "No files!"
                })
            }

            // Upload new cloudinary
            const thumbnail = req.files[0]
            const upThumb = await cloudinary.uploader.upload(thumbnail.path,
                { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
            )

            // Remove old cloudinary
            await cloudinary.uploader.destroy(oldImage)

            // Update database
            await db.execute(
                `update image set url = ?, title = ? where id = ?`,
                [upThumb.secure_url, upThumb.public_id, imageId]
            )

            return res.status(200).json({
                st: 1,
                msg: "Update image successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteImage: async (req, res) => {
        try {
            const { imageId, oldImage } = req.query

            // Validations
            if (!imageId) {
                return res.status(200).json({
                    st: 1,
                    msg: "Missing params!"
                })
            }

            // Remove old cloudinary
            await cloudinary.uploader.destroy(oldImage)

            // Remove database
            await db.execute(
                `delete from image where id = ?`,
                [imageId]
            )

            // Response
            return res.status(200).json({
                st: 1,
                msg: "Delete image successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default imageController