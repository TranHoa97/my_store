import React, { useRef } from 'react'
import orderApi from '../../../services/orderApi'
import numberWithCommas from '../../../utils/numberWithCommas'
import { useDispatch } from 'react-redux'
import { clearItem } from '../../../redux/cartSlice/cartItemSlice'

const FormOrder = (props) => {

    const dispatch = useDispatch()

    const nameRef = useRef()
    const phoneRef = useRef()
    const addressRef = useRef()

    const handleSubmit = async(e) => {
        e.preventDefault()
        const item = e.target
        if (!item.username.value) {
            nameRef.current.classList.add("active")
        } else {
            nameRef.current.classList.remove("active")
        }
        if (!item.phone.value) {
            phoneRef.current.classList.add("active")
        } else {
            phoneRef.current.classList.remove("active")
        }
        if (!item.address.value) {
            addressRef.current.classList.add("active")
        } else {
            addressRef.current.classList.remove("active")
        }

        if (item.username.value && item.phone.value && item.address.value) {
            props.loading(true)
            const res = await orderApi.createOrder({
                orders: props.data,
                username: item.username.value,
                phone: item.phone.value,
                address: item.address.value
            })
            if(res.st === 1) {
                // console.log("success");
                props.orderStatus("Đặt hàng thành công")
                props.loading(false)
                dispatch(clearItem())
            } else {
                // console.log(res.msg);
                props.orderStatus("Đặt hàng không thành công")
                props.loading(false)
            }
        }
    }

    return (
        <div className='form-order'>
            <div className='form-order__title'>
                Thông tin người mua
            </div>
            <form onSubmit={handleSubmit}>
                <div className='form-order__content'>
                    <div className='form-order__content__item'>
                        <input placeholder='Nhập họ và tên...' type="text" name="username" />
                        <label htmlFor="username" ref={nameRef}>Vui lòng điền họ và tên!</label>
                    </div>

                    <div className='form-order__content__item'>
                        <input placeholder='Nhập số điện thoại...' type="text" name="phone" />
                        <label htmlFor="phone" ref={phoneRef}>Vui lòng điền số điện thoại!</label>
                    </div>

                    <div className='form-order__content__item'>
                        <input placeholder='Nhập địa chỉ...' type="text" name="address" />
                        <label htmlFor="address" ref={addressRef}>Vui lòng điền địa chỉ!</label>
                    </div>
                </div>

                <div className='form-order__btn'>
                    <p>Cần thanh toán ({props.totalProducts} sản phẩm)</p>
                    <span>{numberWithCommas(props.totalPrice)} đ</span>
                    <button type='submit'>Hoàn tất đặt hàng</button>
                </div>
            </form>
        </div>
    )
}

export default FormOrder