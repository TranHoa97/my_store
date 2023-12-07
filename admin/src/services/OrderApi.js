import axiosClient from "./AxiosClient"

const orderApi = {
    getOrdersByFilter(query) {
        const url = `/orders/read${query}`
        return axiosClient.get(url)
    },
    createOrder(data) {
        const url = `/orders/create`
        return axiosClient.post(url, data)
    },
    updateOrder(id, data) {
        const url = `/orders/update?id=${id}`
        return axiosClient.put(url, data)
    },
    deleteOrder(id) {
        const url = `/orders/delete?id=${id}`
        return axiosClient.delete(url)
    }
}

export default orderApi