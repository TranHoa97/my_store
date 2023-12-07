import axiosClient from "./AxiosClient"

const groupApi = {
    getAllGroups() {
        const url = `/group/read`
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