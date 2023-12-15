import axiosClient from "./AxiosClient"

const brandApi = {
    getBrandsByFilter(query) {
        let url = `/brand/read`
        if(query) {
            url += `${query}`
        }
        return axiosClient.get(url)
    },

    createBrand(data) {
        const url = `/brand/create`
        return axiosClient.post(url, data)
    },

    updateBrand(id, data) {
        const url = `/brand/update?id=${id}`
        return axiosClient.put(url, data)
    },

    deleteBrand(id) {
        const url = `/brand/delete?id=${id}`
        return axiosClient.delete(url)
    },
}

export default brandApi