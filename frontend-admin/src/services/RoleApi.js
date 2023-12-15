import axiosClient from "./AxiosClient"

const roleApi = {
    getAllRoles() {
        const url = '/role/read'
        return axiosClient.get(url)
    },
    createRole(data) {
        const url = `/role/create`
        return axiosClient.post(url, data)
    },
    updateRole(id, data) {
        const url = `/role/update?id=${id}`
        return axiosClient.put(url, data)
    },
    deleteRole(id) {
        const url = `/role/delete?id=${id}`
        return axiosClient.delete(url)
    }
}

export default roleApi