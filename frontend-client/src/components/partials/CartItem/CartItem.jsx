import React, { useState, useEffect } from 'react'
import numberWithCommas from "../../../utils/numberWithCommas"
import { useDispatch } from 'react-redux'
import { updateItem, removeItem } from '../../../redux/cartSlice/cartItemSlice'

const CartItem = (props) => {

    const dispatch = useDispatch()

    const [item, setItem] = useState(props.data)
    const [quantity, setQuantity] = useState(props.data.quantity)

    useEffect(() => {
        setItem(item)
        setQuantity(props.data.quantity)
    }, [props.data])

    const updateQuantity = (type) => {
        if (type === 'plus') {
            dispatch(updateItem({ ...item, quantity: quantity + 1 }))
        } else {
            dispatch(updateItem({ ...item, quantity: quantity - 1 === 0 ? 1 : quantity - 1 }))
        }
    }

    const removeCartItem = () => {
        dispatch(removeItem(item))
    }

    return (
        <div className="cart-item">
            <div className="cart-item__image">
                <img src={item.thumbnail} alt="" />
            </div>
            <div className="cart-item__info">
                <div className="cart-item__info__header">
                    <span>{item.title}</span>
                    <span onClick={() => removeCartItem()}>
                        <i className="fa-solid fa-trash-can"></i>
                    </span>
                </div>
                <div className="cart-item__info__footer">
                    <div className='cart-item__info__footer__left'>
                        <div>
                            <p>Màu sắc</p>
                            <span style={{ textTransform: "capitalize"}}>{item.color?.label}</span>
                        </div>
                        <div>
                            <p>Số lượng</p>
                            <div className="cart-item__info__footer__quantity">
                                <button className="cart-item__info__footer__quantity__minus" onClick={() => updateQuantity('minus')}>
                                    <i className="fa-solid fa-minus"></i>
                                </button>
                                <div className="cart-item__info__footer__quantity__value">
                                    {quantity}
                                </div>
                                <button className="cart-item__info__footer__quantity__plus" onClick={() => updateQuantity('plus')}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="cart-item__info__footer__price">
                        {numberWithCommas((item.price * quantity))}đ
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem