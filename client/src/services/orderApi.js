import axiosClient from "./axiosClient"

const orderApi = {
    createOrder(data) {
        const url = `/store/order`
        return axiosClient.post(url, data)
    },

}

export default orderApi