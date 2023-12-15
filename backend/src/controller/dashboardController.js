import db from "../models/db"

const dashboardController = {
    getDataDashboard: async(req, res) => {
        try {
            const [totalUser] = await db.execute(
                `select count(id) as totalUser from user`
            )
            const [totalInventory] = await db.execute(
                `select sum(quantity) as totalInventory from variant`
            )
            const [totalOrder] = await db.execute(
                `select count(id) as totalOrder from orders`
            )
            const recentDate = await dashboardController.recentDate(3)
            const [totalRevenue] = await db.execute(
                `select SUM(order_detail.total_price) as totalPrice from order_detail
                left join orders on order_detail.order_id = orders.id
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

            let sql = `select
            orders.*,
            sum(order_detail.total_price) as total_price,
            sum(order_detail.total_quantity) as total_quantity
            from orders
            left join order_detail on orders.id = order_detail.order_id
            where orders.updatedAt between ${recentDate} and now()
            group by orders.id
            order by updatedAt desc
            limit 5`

            const [orders] = await db.execute(sql)

            return res.status(200).json({
                st: 1,
                msg: "Get recent orders successfully!",
                data: orders.length > 0 ? orders : []
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

export default dashboardController