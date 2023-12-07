import axiosClient from "./axiosClient"

const productApi = {
    getProductsHome(category, limit) {
        const url = `/store/homepage?category=${category}&limit=${limit}`
        return axiosClient.get(url)
    },

    getCategories() {
        const url = `/store/categories`
        return axiosClient.get(url)
    },

    getAttributes(category) {
        const url = `/store/attributes?category=${category}`
        return axiosClient.get(url)
    },

    getBrands(category) {
        const url = `/store/brands?category=${category}`
        return axiosClient.get(url)
    },

    getCollections(category, limit, query) {
        const url = `/store/collections${query}&category=${category}&limit=${limit}`
        return axiosClient.get(url)
    },

    getProduct(slug) {
        const url = `/store/product?slug=${slug}`
        return axiosClient.get(url)
    },

    getProductSearch(search) {
        let url = `/store/search`
        if(search) {
            url += `${search}`
        }
        return axiosClient.get(url)
    },
}

export default productApi