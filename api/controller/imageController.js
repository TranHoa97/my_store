const db = require("../model/db")
const cloudinary = require("../configs/cloudinary")
require("dotenv").config()

const imageController = {
    getImages: async(req,res) => {
        try {
            const { search } = req.query

            let sql = `select images.*, products.title as product_name from images
            left join products on images.product_id = products.id
            where images.product_id > 0`

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and (products.title like "%${newSearch}%" 
                or products.id like "%${newSearch}%")`
            }

            sql += ` order by images.product_id asc`

            // Get data
            const [results] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get images successfully!",
                data: results
            })

        }catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createImage: async(req,res) => {
        try {
            // Validations
            if(!req.files) {
                return res.status(200).json({
                    st: 1,
                    msg: "No files!"
                })
            }

            // Upload cloudinary
            const thumbnail = req.files[0]
            const upThumb = await cloudinary.uploader.upload(thumbnail.path,
                { folder: "cuahangdientu", allowedFormats: ['jpg', 'png', 'jpeg'], }
            )
            if(upThumb) {
                // Insert database
                const [createImage] = await db.execute(
                    `insert into images (url, title, product_id) values (?,?,?)`, 
                    [upThumb.secure_url, upThumb.public_id, req.body.product_id]
                )
                if(createImage) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Create image successfully!"
                    })
                } else {
                    return res.status(200).json({
                        st: 1,
                        msg: "Create image failed!"
                    })
                }
            }
        }catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateImage: async(req,res) => {
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
                { folder: "cuahangdientu", allowedFormats: ['jpg', 'png', 'jpeg'], }
            )
            if(upThumb) {
                // Remove old cloudinary
                const removeImage = await cloudinary.uploader.destroy(oldImage)
                // Update database
                const [updateImage] = await db.execute(
                    `update images set url = ?, title = ? where id = ?`, 
                    [upThumb.secure_url, upThumb.public_id, imageId]
                )
                // Return data
                if(updateImage && removeImage) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Update image successfully!"
                    })
                } else {
                    return res.status(200).json({
                        st: 1,
                        msg: "Update image failed!"
                    })
                }
            }
        }catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteImage: async(req,res) => {
        try {
            const { imageId, oldImage } = req.query
            // Validations
            if (!imageId) {
                return res.status(200).json({
                    st: 1,
                    msg: "Missing params!"
                })
            }
            // Remove database
            const [deleteImage] = await db.execute(
                `delete from images where id = ?`,
                [imageId]
            )
            // Remove old cloudinary
            const removeImage = await cloudinary.uploader.destroy(oldImage)
            // Return data
            if (deleteImage && removeImage) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete image successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete image failed!"
                })
            }
        }catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

module.exports = imageController