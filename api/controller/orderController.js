const db = require("../model/db")

const orderController = {
    getOrders: async (req, res) => {
        try {
            const { status, search } = req.query

            // Get Orders
            sql = `select * from orders where id > 0`
            if(status) {
                const newStatus = status.replaceAll("-", " ")
                sql += ` and status = "${newStatus}"`
            }

            if(search) {
                const newSearch = search.toLowerCase().replaceAll("-", " ")
                sql += ` and username like "%${newSearch}%"`
            }

            const [orders] = await db.execute(sql)

            if(orders.length > 0) {
                const results = await orderController.getOrdersByFilter(orders)
                if (results.length > 0) {
                    return res.status(200).json({
                        st: 1,
                        msg: "Get orders successfully!",
                        data: results
                    })
                } else {
                    return res.status(200).json({
                        st: 1,
                        msg: "No orders!",
                        data: []
                    })
                }
            } else {
                return res.status(200).json({
                    st: 1,
                    msg: "No orders!",
                    data: []
                })
            }

        } catch (err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },

    getOrdersByFilter: async(orders) => {
        let results = []
        for (let index = 0; index < orders.length; index++) {
            const [details] = await db.execute(
                `select * from orders_details where order_id = ?`,
                [orders[index].id]
            )
            const totalPrice = details.reduce((total, item) => total + Number(item.price), 0)
            const totalQty = details.reduce((total, item) => total + Number(item.quantity), 0)

            results.push({
                ...orders[index],
                details: details,
                total_price: totalPrice,
                total_quantity: totalQty
            })
        }
        return results
    },

    createOrder: async (req, res) => {
        try {
            const { username, address, phone, products, status } = req.body

            if (!username || !address || !phone || !products || !status) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [orders] = await db.execute(
                `insert into orders (address, username, phone, status) values (?,?,?,?)`,
                [address, username, phone, status || "Đang chờ duyệt"]
            )

            if (orders) {
                products.forEach(async (item) => {
                    await db.execute(
                        `insert into orders_details 
                        (price, quantity, variants_id, order_id, color) 
                        values (?,?,?,?,?)`,
                        [item.amount, item.quantity, item.variants_id, orders.insertId, item.color]
                    )
                })
                return res.status(200).json({
                    st: 1,
                    msg: "Create order successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Create order failed!"
                })
            }

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

            if (!username || !address || !phone || !products || !status) {
                return res.status(200).json({
                    st: 0,
                    msg: "Missing params!"
                })
            }

            const [orders] = await db.execute(
                `update orders set address = ?, username = ?, phone = ?, status = ?, updatedAt = now()
                where id = ?`,
                [address, username, phone, status, id]
            )

            if (orders) {
                const [remove] = await db.execute(
                    `delete from orders_details where order_id = ?`,
                    [id]
                )
                if (remove) {
                    products.forEach(async (item) => {
                        await db.execute(
                            `insert into orders_details 
                            (price, quantity, variants_id, order_id, color) 
                            values (?,?,?,?,?)`,
                            [item.amount, item.quantity, item.variants_id, id, item.color]
                        )
                    })
                }
                return res.status(200).json({
                    st: 1,
                    msg: "Update order successfully!"
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "Update order failed!"
                })
            }

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

            const results = await db.execute(
                `delete from orders where id = ?`,
                [id]
            )

            if (results) {
                return res.status(200).json({
                    st: 1,
                    msg: "Delete order successfully!",
                })
            } else {
                return res.status(200).json({
                    st: 0,
                    msg: "No data!",
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

module.exports = orderController