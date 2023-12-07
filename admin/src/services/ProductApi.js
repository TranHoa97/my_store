import axiosClient from "./AxiosClient"

const productApi = {
    getProductsByFilter(query) {
        let url = `/products/read`
        if(query) {
            url += `${query}`
        }
        return axiosClient.get(url)
    },

    createProduct(data) {
        const url = `/products/create`
        return axiosClient.post(url, data)
    },
    updateProduct(id, data) {
        const url = `/products/update?id=${id}`
        return axiosClient.put(url, data)
    },
    deleteProduct(id, thumbname) {
        const url = `/products/delete?id=${id}&thumbname=${thumbname}`
        return axiosClient.delete(url)
    }
}

export default productApi