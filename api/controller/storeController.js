const db = require("../model/db")

const storeController = {
    getProductsHomePage: async (req, res) => {
        try {
            const { category, limit } = req.query
            let sql = `select products.id, products.thumbnail, category.slug as category, 
                products.title, products.slug, sum(variants.sold) as total_sold from products
                left join category on products.category_id = category.id
                left join variants on products.id = variants.product_id
                where category.id = ? or category.slug = ?
                group by products.id
                order by total_sold desc
                limit ?`

            const [products] = await db.execute(sql, [category, category, limit])

            const results = []

            for (let index = 0; index < products.length; index++) {
                const [variants] = await db.execute(
                    `select * from variants where product_id = ? order by sold desc`,
                    [products[index].id]
                )
                results.push({
                    ...products[index],
                    variants: variants[0]
                })
            }

            return res.status(200).json({
                st: 1,
                msg: "Get products home successfully!",
                data: results
            })

        } catch (err) {
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
                data: categories
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

            let sql = `select attributes.id, attributes.title from attributes
            left join category on attributes.category_id = category.id
            where category.slug = ?`

            const [attributes] = await db.execute(sql, [category])

            let results = []
            for (let index = 0; index < attributes.length; index++) {
                const [value] = await db.execute(
                    `select id, title, slug from attributes_values where attributes_id = ?`,
                    [attributes[index].id]
                )
                results.push({
                    ...attributes[index],
                    value: value
                })
            }

            return res.status(200).json({
                st: 1,
                msg: "Get attributes successfully!",
                data: [...results]
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
                data: brands
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
            const { category, limit, sort, cpu, chipset, ram, storage, display, graphics, brand } = req.query

            let sql = `select products.id, products.thumbnail, category.slug as category, brand.slug as brand, 
            products.title, products.slug, sum(variants.sold) as total_sold, min(variants.price) as min_price
            from products
            left join category on products.category_id = category.id
            left join brand on products.brand_id = brand.id
            left join variants on products.id = variants.product_id
            left join products_attributes on products.id = products_attributes.product_id
            left join attributes_values on products_attributes.value_id = attributes_values.id
            where category.slug = ?`

            // Brand
            if (brand) {
                let arr = []
                const newArr = arr.concat(brand).join("','")
                sql += ` and brand.slug IN('${newArr}')`
            }
            // Cpu
            if (cpu) {
                let arr = []
                const newArr = arr.concat(cpu).join("','")
                sql += ` and attributes_values.slug IN('${newArr}')`
            }
            // chipset
            if (chipset) {
                let arr = []
                const newArr = arr.concat(chipset).join("','")
                sql += ` and attributes_values.slug IN('${newArr}')`
            }
            // display
            if (display) {
                let arr = []
                const newArr = arr.concat(display).join("','")
                sql += ` and attributes_values.slug IN('${newArr}')`
            }
            // graphics
            if (graphics) {
                let arr = []
                const newArr = arr.concat(graphics).join("','")
                sql += ` and attributes_values.slug IN('${newArr}')`
            }
            // ram
            if (ram) {
                let arr = []
                const newArr = arr.concat(ram).join("','")
                sql += ` and attributes_values.slug IN('${newArr}')`
            }
            // storage
            if (storage) {
                let arr = []
                const newArr = arr.concat(storage).join("','")
                sql += ` and attributes_values.slug IN('${newArr}')`
            }

            // sort
            if (sort) {
                sql += ` group by products.id`
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

            // limit
            if(limit) {
                sql += ` limit ${limit}`
            }

            const [products] = await db.execute(sql, [category])

            let results = []
            for (let index = 0; index < products.length; index++) {
                const [variants] = await db.execute(
                    `select * from variants where product_id = ?`,
                    [products[index].id]
                )
                results.push({
                    ...products[index],
                    variants: variants
                })
            }

            return res.status(200).json({
                st: 1,
                msg: "Get products successfully!",
                data: results
            })


        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getProduct: async(req, res) => {
        try {
            const { slug } = req.query
            
            const [product] = await db.execute(
                `select * from products where slug like "%${slug}%"`,
                [slug]
            )
            const [images] = await db.execute(
                `select * from images where product_id = ?`,
                [product[0].id]
            )
            const [variants] = await db.execute(
                `select * from variants where product_id = ?`,
                [product[0].id]
            )

            let newVariants = []
            for (let index = 0; index < variants.length; index++) {
                const [colors] = await db.execute(
                    `select * from variants_colors where variants_id = ?`,
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
        }catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getProductsSearch: async(req, res) => {
        try {
            const { search } = req.query

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")

                let sql = `select products.id, products.title, products.thumbnail, products.slug, category.slug as category  
                from products 
                left join category on products.category_id = category.id 
                left join brand on products.brand_id = brand.id
                where products.slug like "%${newSearch}%" 
                or products.title like "%${newSearch}%"`
    
                const [products] = await db.execute(sql)
    
                let results = []
                for (let index = 0; index < products.length; index++) {
                    const [variants] = await db.execute(
                        `select * from variants where product_id = ?`,
                        [products[index].id]
                    )

                    results.push({
                        ...products[index],
                        variants: variants
                    })
                }

                return res.status(200).json({
                    st: 1,
                    msg: "Get products suggest successfully!",
                    data: results
                })
            } else {
                return res.status(200).json({
                    st: 1,
                    msg: "Get products suggest successfully!",
                    data: []
                })
            }

        }catch(err) {
            console.log(err);
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    createOrder: async(req,res) => {
        try {
            const { username, phone, address, orders } = req.body
            const [createOrder] = await db.execute(
                `insert into orders (username, address, phone, status)
                values (?,?,?,?)`,
                [username, address, phone, "Đang xử lý"]
            )
            if(createOrder) {
                for (let index = 0; index < orders.length; index++) {
                    await db.execute(
                        `insert into orders_details (price, quantity, variants_id, order_id, color)
                        values (?,?,?,?,?)`,
                        [orders[index].price, orders[index].quantity, orders[index].variants_id, createOrder.insertId, orders[index].color.title]
                    )
                }
                return res.status(200).json({
                    st: 1,
                    msg: "Create order successfully!"
                })
            }
        }catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    }
}

module.exports = storeController