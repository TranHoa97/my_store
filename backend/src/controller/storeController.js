import db from "../models/db"

const storeController = {
    getProductsHomePage: async (req, res) => {
        try {
            const { category, limit } = req.query

            let sql = `select 
            product.*,
            category.slug as category_slug,
            sum(variant.sold) as total_sold,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    "id", variant.id,
                    "title", variant.title,
                    "price", variant.price,
                    "cpu", variant.cpu,
                    "ram", variant.ram,
                    "storage", variant.storage,
                    "display", variant.display,
                    "graphics", variant.graphics,
                    "weight", variant.weight,
                    "slug", variant.slug
                )
            ) as variants
            from product
            left join category on category.id = product.category_id
            left join variant on variant.product_id = product.id
            where (category.id = ? or category.slug = ?)
            group by product.id
            order by total_sold desc
            limit ?`

            const [products] = await db.execute(sql, [category, category, limit])

            return res.status(200).json({
                st: 1,
                msg: "Get products home successfully!",
                data: products.length > 0 ? products : []
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getCategories: async (req, res) => {
        try {
            const [categories] = await db.execute(
                `select * from category`
            )
            return res.status(200).json({
                st: 1,
                msg: "Get categories successfully!",
                data: categories.length > 0 ? categories : []
            })
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getAttributes: async (req, res) => {
        try {
            const { category } = req.query

            let sql = `select 
            attribute.*,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    "id", attribute_value.id,
                    "label", attribute_value.label,
                    "slug", attribute_value.slug
                )
            ) as value 
            from attribute
            left join category on attribute.category_id = category.id
            left join attribute_value on attribute_value.attribute_id = attribute.id
            where category.slug = ?
            group by attribute.id`

            const [attributes] = await db.execute(sql, [category])

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

    getBrands: async (req, res) => {
        try {
            const { category } = req.query
            const [brands] = await db.execute(
                `select brand.* from brand
                left join category on brand.category_id = category.id
                where category.slug = ?`,
                [category]
            )
            return res.status(200).json({
                st: 1,
                msg: "Get brands successfully!",
                data: brands.length > 0 ? brands : []
            })
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getProductsCollectionPage: async (req, res) => {
        try {
            const { category, limit, sort, brand, ...filter } = req.query

            let sql = `select 
            product.*,
            category.slug as category_slug,
            brand.slug as brand_slug,
            sum(distinct variant.sold) as total_sold, 
            min(variant.price) as min_price
            from product
            left join category on product.category_id = category.id
            left join brand on product.brand_id = brand.id
            left join variant on product.id = variant.product_id
            left join product_attribute on product.id = product_attribute.product_id
            left join attribute_value on product_attribute.value_id = attribute_value.id
            where category.slug = ?`

            // Brand
            if (brand) {
                let arr = []
                const newArr = arr.concat(brand).join("','")
                sql += ` and brand.slug IN('${newArr}')`
            }
            
            // Filter
            let obj = new Object
            for(let key in filter) {
                if(typeof filter[key] === "string") {
                    obj[key] = [filter[key]]
                } else {
                    obj[key] = filter[key]
                }
            }
            let arr = []
            for(let key in obj) {
                arr = arr.concat(obj[key])
            }
            if(arr.length > 0) {
                let newArr = arr.join("','")
                sql += ` and attribute_value.slug IN('${newArr}')`
            }
            
            // Sort
            if (sort) {
                sql += ` group by product.id`
                switch (sort) {
                    case "ban-chay-nhat":
                        sql += ` order by total_sold desc`
                        break;
                    case "gia-thap-den-cao":
                        sql += ` order by min_price desc`
                        break;
                    case "gia-cao-den-thap":
                        sql += ` order by min_price asc`
                        break;
                }
            }

            // Limit
            if (limit) {
                sql += ` limit ${Number(limit) + 20}`
            }

            const [products] = await db.execute(sql, [category])

            let results = []
            for (let index = 0; index < products.length; index++) {
                const [variants] = await db.execute(
                    `select * from variant where product_id = ?`,
                    [products[index].id]
                )
                results.push({
                    ...products[index],
                    variants: variants
                })
            }

            return res.status(200).json({
                st: 1,
                msg: "Get product successfully!",
                data: results,
                filter: { ...obj, sort: sort, brand: typeof brand === "string" ? [brand] : brand }
            })


        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getProduct: async (req, res) => {
        try {
            const { slug } = req.query

            const [product] = await db.execute(
                `select * from product where slug = ?`,
                [slug]
            )
            const [images] = await db.execute(
                `select * from image where product_id = ?`,
                [product[0].id]
            )
            const [variants] = await db.execute(
                `select * from variant where product_id = ?`,
                [product[0].id]
            )

            let newVariants = []
            for (let index = 0; index < variants.length; index++) {
                const [colors] = await db.execute(
                    `select * from color where variant_id = ?`,
                    [variants[index].id]
                )
                newVariants.push({
                    ...variants[index],
                    colors: colors
                })
            }

            return res.status(200).json({
                st: 1,
                msg: "Get single product successfully!",
                data: { ...product[0], variants: newVariants, images: images }
            })
        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getProductsSearch: async (req, res) => {
        try {
            const { search } = req.query

            let sql = `select 
                product.id, 
                product.title, 
                product.thumbnail, 
                product.slug, 
                category.slug as category_slug,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        "id", variant.id,
                        "title", variant.title,
                        "price", variant.price,
                        "cpu", variant.cpu,
                        "ram", variant.ram,
                        "storage", variant.storage,
                        "display", variant.display,
                        "graphics", variant.graphics,
                        "weight", variant.weight,
                        "slug", variant.slug
                    )
                ) as variants
                from product 
                left join category on product.category_id = category.id 
                left join brand on product.brand_id = brand.id
                left join variant on variant.product_id = product.id
                where product.id is not null`

            if (search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and (product.slug like "%${newSearch}%" 
                or product.title like "%${newSearch}%")`
            }

            sql += ` group by product.id`

            const [products] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get products suggest successfully!",
                data: products.length > 0 ? products : []
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createOrder: async (req, res) => {
        try {
            const { username, phone, address, orders } = req.body

            // Validation
            if(!username || !phone || !address || !orders) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Insert orders
            const [createOrder] = await db.execute(
                `insert into orders (username, address, phone, status)
                values (?,?,?,?)`,
                [username, address, phone, "Đang xử lý"]
            )

            // Inser order_detail
            let newOrders = orders.map(item => {
                return `(${item.price}, ${item.quantity}, ${item.variants_id}, ${createOrder.insertId}, "${item.color.label}")`
            })
            await db.execute(
                `insert into order_detail (total_price, total_quantity, variant_id, order_id, color)
                values ${newOrders.toString()}`
            )
                
            return res.status(200).json({
                st: 1,
                msg: "Create order successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    }
}

export default storeController