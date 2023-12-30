import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

import productApi from '../../services/productApi'
import ProductCard from '../../components/partials/ProductCard/ProductCard'

const SearchPage = () => {

    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const search = searchParams.get("search")

    const [products, setProducts] = useState(null)

    const fetchProducts = async () => {
        try {
            const res = await productApi.getProductSearch(location.search)
            if (res.st === 1) {
                setProducts(res.data)
            } else {
                setProducts([])
            }
        } catch(err) {
            alert("Something wrong!")
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [searchParams])

    return (
        <>
            <section>
                <div className="wrapper">
                    <div className="search-page">
                        <div className="search-page__title">
                            Tìm thấy <span>{products?.length}</span> kết quả với từ khóa <span>"{search.replaceAll("-"," ")}"</span>
                        </div>
                        <div className="search-page__list">
                            {
                                products && products.map((item, index) => (
                                    <div className='search-page__list__item' key={index}>
                                        <ProductCard data={item} variants={true} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SearchPage