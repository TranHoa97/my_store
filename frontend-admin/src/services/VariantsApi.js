import axiosClient from "./AxiosClient"

const variantsApi = {
    getAllVariants() {
        const url = `/variants/read`
        return axiosClient.get(url)
    },
    getVariants(query) {
        const url = `/variants/read?productId=${query}`
        return axiosClient.get(url)
    },
    getVariantsById(id) {
        const url = `/variants/view-by-id?id=${id}`
        return axiosClient.get(url)
    },
    createVariants(data) {
        const url = `/variants/create`
        return axiosClient.post(url, data)
    },
    updateVariants(id, data) {
        const url = `/variants/update?id=${id}`
        return axiosClient.put(url, data)
    },
    deleteVariants(id) {
        const url = `/variants/delete?id=${id}`
        return axiosClient.delete(url)
    }
}

export default variantsApi