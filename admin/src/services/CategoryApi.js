import axiosClient from "./AxiosClient"

const categoryApi = {
    getAllCategories() {
        const url = '/category/read'
        return axiosClient.get(url)
    },
    createCateogry(data) {
        const url = `/category/create`
        return axiosClient.post(url, data)
    },
    updateCateogry(id, data) {
        const url = `/category/update?id=${id}`
        return axiosClient.put(url, data)
    },
    deleteCateogry(id) {
        const url = `/category/delete?id=${id}`
        return axiosClient.delete(url)
    },
}

export default categoryApi