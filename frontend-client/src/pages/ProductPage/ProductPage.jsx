import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import productApi from '../../services/productApi'
import BreadCrumb from '../../components/partials/BreadCrumb/BreadCrumb'
import ProductView from '../../components/partials/ProductView/ProductView'
import SlickCarousel from '../../components/partials/SlickCarousel/SlickCarousel'
import ProductCard from '../../components/partials/ProductCard/ProductCard'

const ProductPage = () => {
  const params = useParams()
  const [singleProduct, setSingleProduct] = useState(null)
  const [multiProducts, setMultiProducts] = useState(null)

  const categories = useSelector(state => state.category.value)

  const fetchMultiProducts = async (category, limit) => {
    try {
      const res = await productApi.getProductsHome(category, limit)
      if (res.st === 1) {
        setMultiProducts(res.data)
      } else {
        setMultiProducts([])
      }
    } catch (err) {
      alert("Something wrong!")
    }
  }

  const fetchSingleProduct = async () => {
    try {
      const res = await productApi.getProduct(params.slug)
      if (res.st === 1) {
        setSingleProduct(res.data)
      } else {
        setSingleProduct([])
      }
    } catch (err) {
      alert("Something wrong!")
    }
  }

  useEffect(() => {
    fetchSingleProduct()
    fetchMultiProducts(params.category, 5)
  }, [params])

  return (
    <>
      {/* Breadcrumb */}
      <div className="wrapper">
        <BreadCrumb
          collections={categories?.find(item => item.slug === params.category)}
          title={singleProduct?.brand_label}
        />
      </div>

      {/* Product View */}
      <div className="wrapper">
        {singleProduct ? (
          <ProductView data={singleProduct} />
        ) : (<></>)}
      </div>

      {/* Other Products */}
      <div className="wrapper">
        <div className="other-products">
          <div className="other-products__title">Các sản phẩm khác</div>
          <div className="other-products__content">
            <SlickCarousel
              data={multiProducts}
              dots={false}
              asNavFor={false}
              show={4}
              responsive={2}
              product={true}
            />
          </div>
        </div>
      </div>

    </>
  )
}

export default ProductPage