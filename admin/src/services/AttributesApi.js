import axiosClient from "./AxiosClient"

const attributesApi = {
    getAttributesByFilter(query) {
        let url = `/attributes/read`
        if(query) {
            url += `${query}`
        }
        return axiosClient.get(url)
    },

    createAttributes(data) {
        const url = `/attributes/create`
        return axiosClient.post(url, data)
    },

    updateAttributes(id, data) {
        const url = `/attributes/update?id=${id}`
        return axiosClient.put(url, data)
    },

    deleteAttributes(id) {
        const url = `/attributes/delete?id=${id}`
        return axiosClient.delete(url)
    },

    // VALUE

    getAttributesValue(id) {
        const url = `/attributes/read-value?id=${id}`
        return axiosClient.get(url)
    },

    createAttributesValue(data) {
        const url = `/attributes/create-value`
        return axiosClient.post(url, data)
    },

    updateAttributesValue(id, data) {
        const url = `/attributes/update-value?id=${id}`
        return axiosClient.put(url, data)
    },

    deleteAttributesValue(id) {
        const url = `/attributes/delete-value?id=${id}`
        return axiosClient.delete(url)
    },
}

export default attributesApi