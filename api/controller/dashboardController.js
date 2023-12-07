const db = require("../model/db")

const dashboardController = {
    getDataDashboard: async(req, res) => {
        try {
            const [totalUser] = await db.execute(
                `select count(id) as totalUser from users`
            )
            const [totalInventory] = await db.execute(
                `select sum(quantity) as totalInventory from variants`
            )
            const [totalOrder] = await db.execute(
                `select count(id) as totalOrder from orders`
            )

            const recentDate = await dashboardController.recentDate(3)
            const [totalRevenue] = await db.execute(
                `select SUM(orders_details.price) as totalPrice from orders_details
                left join orders on orders_details.order_id = orders.id
                where orders.updatedAt between ${recentDate} and now()`
            )
            return res.status(200).json({
                st: 1,
                msg: "Get dashboard successfully!",
                data: {
                    totalUser: totalUser[0].totalUser,
                    totalInventory: totalInventory[0].totalInventory,
                    totalOrder: totalOrder[0].totalOrder,
                    totalRevenue: totalRevenue[0].totalPrice
                }
            })
        }catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
    
    getRecentOrders: async(req, res) => {
        try {
            const recentDate = await dashboardController.recentDate(3)

            const [orders] = await db.execute(
                `select * from orders where orders.updatedAt between ${recentDate} and now()
                order by updatedAt desc limit 5`
            )
            let results = []
            for (let index = 0; index < orders.length; index++) {
                const [item] = await db.execute(
                    `select price, quantity from orders_details where order_id = ?`,
                    [orders[index].id]
                )
                results.push({
                    ...orders[index],
                    total_price: item.reduce((total,e) => total + Number(e.price), 0),
                    total_quantity: item.reduce((total,e) => total + Number(e.quantity), 0)
                })
            }
            return res.status(200).json({
                st: 1,
                msg: "Get recent orders successfully!",
                data: results
            })
        }catch(err) {
            return res.status(500).json({
                st: 0,
                msg: err.message
            })
        }
    },
   
    recentDate: async (day) => {
        const date = Date.now() - (1000 * 60 * 60 * 24 * day)
        const newDate = new Date(date)

        const year = newDate.getFullYear()
        const month = newDate.getMonth()
        const day1 = newDate.getDate()

        const results = `${year}-${month}-${day1}`

        return results
    },
}

module.exports = dashboardController