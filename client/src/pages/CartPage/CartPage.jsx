import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CartItem from '../../components/partials/CartItem/CartItem'
import { Link } from 'react-router-dom'

import emptyCart from "../../assets/no-result/empty-cart.png"
import FormOrder from '../../components/partials/formOrder/FormOrder'

const CartPage = () => {

  const cartItems = useSelector(state => state.cartItems.value)

  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isFetching, setIsFetching] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)

  useEffect(() => {
    setTotalPrice(cartItems.reduce((total, item) => total + (Number(item.quantity) * Number(item.price)), 0))
    setTotalProducts(cartItems.reduce((total, item) => total + Number(item.quantity), 0))
  }, [cartItems])

  useEffect(() => {
    setOrderStatus(null)
  }, [])

  return (
    <>
      <div className="wrapper">
        <Link to={"/"}>
          <div className='cart__back'>
            <i className="fa-solid fa-chevron-left"></i>
            <span>Tiếp tục mua sắm</span>
          </div>
        </Link>
      </div>

      <section>
        <div className="wrapper">
          <div className="cart">
            {
              orderStatus ? (
                <div className="cart__order-results">
                  <p>{orderStatus}!</p>
                </div>
              ) : (
                <>
                  {
                    cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
                        <div className="cart__item" key={index}>
                          <CartItem data={item} />
                        </div>
                      ))
                    ) : (
                      <div className='cart__no-products'>
                        <img src={emptyCart} alt="" />
                        <p>Chưa có sản phẩm nào trong giỏ hàng!</p>
                        <Link to={"/"}>
                          <div className='cart__no-products__btn'>Mua hàng</div>
                        </Link>
                      </div>
                    )
                  }

                  {
                    cartItems.length > 0 ? (
                      <FormOrder
                        data={cartItems}
                        totalProducts={totalProducts}
                        totalPrice={totalPrice}
                        loading={setIsFetching}
                        orderStatus={setOrderStatus}
                      />
                    ) : (
                      <></>
                    )
                  }
                </>
              )
            }

            {
              isFetching ? (
                <div className="cart__loading">
                  <span><i className="fa-solid fa-circle-notch"></i></span>
                  <span>Loading...</span>
                </div>
              ) : (<></>)
            }

          </div>
        </div>
      </section>
    </>
  )
}

export default CartPage