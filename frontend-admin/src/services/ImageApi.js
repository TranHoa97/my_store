import axiosClient from "./AxiosClient"

const imageApi = {
    getImagesByFilter(query) {
        let url = `/images/read`
        if(query) {
            url += `${query}`
        }
        return axiosClient.get(url)
    },
    createImage(data) {
        const url = `/images/create`
        return axiosClient.post(url, data)
    },
    updateImage(id, oldImage, data) {
        const url = `/images/update?imageId=${id}&oldImage=${oldImage}`
        return axiosClient.put(url, data)
    },
    deleteImage(id, oldImage) {
        const url = `/images/delete?imageId=${id}&oldImage=${oldImage}`
        return axiosClient.delete(url)
    },
}

export default imageApi