import axiosClient from "./AxiosClient"

const groupApi = {
    getGroupByFilter(query) {
        let url = `/group/read`
        if(query) {
            url += `${query}`
        }
        return axiosClient.get(url)
    },
    createGroup(data) {
        const url = `/group/create`
        return axiosClient.post(url, data)
    },
    updateGroup(id, data) {
        const url = `/group/update?id=${id}`
        return axiosClient.put(url, data)
    },
    deleteGroup(id) {
        const url = `/group/delete?id=${id}`
        return axiosClient.delete(url)
    }
}

export default groupApi