import axiosClient from "./AxiosClient"

const dashboardApi = {
    getDataDashboard() {
        const url = '/dashboard/read'
        return axiosClient.get(url)
    },
    getRecentOrders() {
        const url = '/dashboard/recent-orders'
        return axiosClient.get(url)
    },
}

export default dashboardApi