import axiosClient from "./AxiosClient"

const userApi = {
    getUserByFilter(query) {
        let url = `/user/read`
        if(query) {
            url += `${query}`
        }
        return axiosClient.get(url)
    },
    createUser(data) {
        const url = `/user/create`
        return axiosClient.post(url, data)
    },
    updateUser(id, data) {
        const url = `/user/update?id=${id}`
        return axiosClient.put(url, data)
    },
    deleteUser(id) {
        const url = `/user/delete?id=${id}`
        return axiosClient.delete(url)
    }
}

export default userApi