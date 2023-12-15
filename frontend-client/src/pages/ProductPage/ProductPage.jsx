import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import productApi from '../../services/productApi'
import BreadCrumb from '../../components/partials/BreadCrumb/BreadCrumb'
import ProductView from '../../components/partials/ProductView/ProductView'
import SlickCarousel from '../../components/partials/SlickCarousel/SlickCarousel'

const ProductPage = () => {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [products, setProducts] = useState(null)

  const categories = useSelector(state => state.category.value)

  const fetchData = async (category, limit) => {
    const res = await productApi.getProductsHome(category, limit)
    if(res.st === 1) {
      setProducts(res.data)
    }
  }

  const fetchProduct = async () => {
    const res = await productApi.getProduct(params.slug)
    if (res.st === 1) {
      setProduct(res.data)
    } else {
      console.log(res.msg);
    }
  }

  useEffect(() => {
    fetchProduct()
    fetchData(params.category, 5)
  }, [params])
  return (
    <>
      {/* Breadcrumb */}
      <div className="wrapper">
        <BreadCrumb
          collections={categories?.find(item => item.slug === params.category)}
          title={product?.title}
        />
      </div>

      {/* Product View */}
      <div className="wrapper">
        {product ? (
          <ProductView data={product} />
        ) : (<></>)}
      </div>

      {/* Other Products */}
      <div className="wrapper">
        <div className="other-products">
          <div className="other-products__title">Các sản phẩm khác</div>
          <div className="other-products__content">
            {products ? (
              <SlickCarousel
                product={products}
                dots={false}
                mainSlideArrow={true}
                subSlideArrow={false}
                asNavFor={false}
                mainShow={4}
                responsive={2}
              />
            ) : (<></>)}
          </div>
        </div>
      </div>

    </>
  )
}

export default ProductPage