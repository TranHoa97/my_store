import axiosClient from "./AxiosClient"

const variantsApi = {
    getVariantByFilter(query) {
        let url = `/variants/read`
        if(query) {
            url += `${query}`
        }
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