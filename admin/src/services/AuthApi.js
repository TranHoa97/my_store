import axiosClient from "./AxiosClient"

const authApi = {
    registerUser(data) {
        const url = '/auth/register'
        return axiosClient.post(url, data)
    },

    loginUser(data) {
        const url = `/auth/login`
        return axiosClient.post(url, data)
    },

    logoutUser() {
        const url = '/auth/logout'
        return axiosClient.post(url)
    },

    updateUser(id, data) {
        const url = `/auth/update?id=${id}`
        return axiosClient.post(url, data)
    },

    getAccount(id) {
        const url = `/auth/account?id=${id}`
        return axiosClient.get(url)
    },
}

export default authApi