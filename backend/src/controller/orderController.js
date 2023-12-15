import db from "../models/db"

const orderController = {
    getOrders: async (req, res) => {
        try {
            const { status, search } = req.query

            // Get Orders
            let sql = `select
            orders.*,
            sum(order_detail.total_price) as total_price,
            sum(order_detail.total_quantity) as total_quantity,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    "id", order_detail.id,
                    "total_price", order_detail.total_price,
                    "total_quantity", order_detail.total_quantity,
                    "variant_id", order_detail.variant_id,
                    "color", order_detail.color
                )
            ) as details
            from orders
            left join order_detail on orders.id = order_detail.order_id
            where orders.id is not null`

            if (status) {
                const newStatus = status.replaceAll("-", " ")
                sql += ` and orders.status = "${newStatus}"`
            }

            if (search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and orders.username like "%${newSearch}%"`
            }

            sql += ` group by orders.id`

            const [orders] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get orders successfully!",
                data: orders.length > 0 ? orders : []
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
            const { username, address, phone, products, status } = req.body

            // Validation
            if (!username || !address || !phone || !products || !status) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Insert orders
            const [orders] = await db.execute(
                `insert into orders (address, username, phone, status) values (?,?,?,?)`,
                [address, username, phone, status]
            )

            // Insert orders detail
            let newProducts = products.map(item => {
                return `(${item.amount}, ${item.quantity}, ${item.variants_id}, ${orders.insertId}, "${item.color}")`
            })
            await db.execute(
                `insert into order_detail (total_price, total_quantity, variant_id, order_id, color)
                values ${newProducts.toString()}`
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
    },

    updateOrder: async (req, res) => {
        try {
            const { id } = req.query
            const { username, address, phone, products, status } = req.body

            // Validation
            if (!username || !address || !phone || !products || !status) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Update order
            await db.execute(
                `update orders set address = ?, username = ?, phone = ?, status = ?, updatedAt = now()
                where id = ?`,
                [address, username, phone, status, id]
            )

            // Remove old order
            await db.execute(
                `delete from order_detail where order_id = ?`,
                [id]
            )

            // Update new order
            let newOrders = products.map(item => {
                return `(${item.amount}, ${item.quantity}, ${item.variants_id}, ${id}, "${item.color}")`
            })
            await db.execute(
                `insert into order_detail (total_price, total_quantity, variant_id, order_id, color)
                values ${newOrders.toString()}`
            )

            return res.status(200).json({
                st: 1,
                msg: "Update order successfully!"
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.query

            // Validation
            if(!id) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            // Delete orders
            await db.execute(
                `delete from orders where id = ?`,
                [id]
            )

            return res.status(200).json({
                st: 1,
                msg: "Delete order successfully!",
            })

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
}

export default orderController