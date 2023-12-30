import db from "../models/db"
import cloudinary from "../config/cloudinary"
require("dotenv").config()

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const { page, limit, search } = req.query

            let sql = `select * from category where id is not null`
            let sqlTotal = `select count(*) as count from category where id is not null`

            if(search) {
                sql += ` and (category.label like "%${search}%" 
                or category.slug like "%${search}%"
                or category.id like "%${search}%")`

                sqlTotal += ` and (category.label like "%${search}%" 
                or category.slug like "%${search}%"
                or category.id like "%${search}%")`
            }

            sql += ` order by id asc`

            if(limit) {
                sql += ` limit ${limit}`
            }

            if(page) {
                const offset = (page - 1) * limit
                sql += ` offset ${offset}`
            }

            const [category] = await db.execute(sql)

            const [totalCategory] = await db.execute(sqlTotal)

            return res.status(200).json({
                st: 1,
                msg: "Get category successfully!",
                data: {
                    data: category.length > 0 ? category : [],
                    pagination: {
                        page: +(page),
                        limit: +(limit),
                        total: +(totalCategory[0]?.count)
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

    createCategory: async (req, res) => {
        try {
            // console.log(req.body);
            const { label, slug } = req.body

            // Validation
            if (!label || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Up cloudinary
            let upIcon
            let upImage
            if (req.files && req.files.length > 0) {
                const icon = req.files.find(item => item.fieldname === "icon")
                upIcon = await cloudinary.uploader.upload(icon.path,
                    { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
                )

                const image = req.files.find(item => item.fieldname === "image")
                upImage = await cloudinary.uploader.upload(image.path,
                    { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
                )
            }

            // Insert category
            await db.execute(
                `insert into category (label, slug, icon_url, icon_name, image_url, image_name) 
                values (?,?,?,?,?,?)`,
                [label, slug, upIcon.secure_url, upIcon.public_id, upImage.secure_url, upImage.public_id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Create new category successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id } = req.query
            const { label, slug } = req.body

            // Validation
            if (!id || !label || !slug) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Up cloudinary
            let upIcon
            let upImage
            if (req.files && req.files.length > 0) {
                const icon = req.files.find(item => item.fieldname === "icon")
                if(icon) {
                    upIcon = await cloudinary.uploader.upload(icon.path,
                        { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
                    )
                }

                const image = req.files.find(item => item.fieldname === "image")
                if(image) {
                    upImage = await cloudinary.uploader.upload(image.path,
                        { folder: process.env.CLOUDINARY_FOLDER, allowedFormats: ['jpg', 'png', 'jpeg'], }
                    )
                }

                if (upIcon) {
                    await cloudinary.uploader.destroy(req.body.icon_name)
                    await db.execute(
                        `update category set icon_url = ?, icon_name = ? where id = ?`,
                        [upIcon.secure_url, upIcon.public_id, id]
                    )
                }
                if (upImage) {
                    await cloudinary.uploader.destroy(req.body.image_name)
                    await db.execute(
                        `update category set image_url = ?, image_name = ? where id = ?`,
                        [upImage.secure_url, upImage.public_id, id]
                    )
                }
            }

            // Update category
            await db.execute(
                `update category set label = ?, slug = ? where id = ?`,
                [label, slug, id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Update category successfully!"
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.query

            // Validation
            if (!id) {
                return res.status(404).json({
                    st: 0,
                    msg: "Missing params"
                })
            }

            // Remove cloudinary
            const [category] = await db.execute(
                `select * from category where id = ?`,
                [id]
            )
            await cloudinary.uploader.destroy(category[0].icon_name)
            await cloudinary.uploader.destroy(category[0].image_name)

            // Delete category
            await db.execute(
                `delete from category where id = ?`,
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete category successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default categoryController