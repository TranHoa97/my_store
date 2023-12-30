import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SlickCarousel from '../SlickCarousel/SlickCarousel'
import numberWithCommas from '../../../utils/numberWithCommas'

import { addItem } from '../../../redux/cartSlice/cartItemSlice'

const ProductView = (props) => {

    const { images, thumbnail, variants } = props.data

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [view, setView] = useState(variants[0])
    const [color, setColor] = useState(null)

    const handleChange = (id) => {
        const newVariants = variants.find(item => item.id === id)
        setView(newVariants)
        setColor(newVariants.colors[0]?.id)
    }

    const handleChangeColor = (id) => {
        const newColor = view.colors.find(item => item.id === id)
        setColor(newColor.id)
    }

    const addToCart = () => {
        navigate(`/cart`)
        let newItem = {
            variants_id: view.id,
            title: view.title,
            thumbnail: thumbnail,
            price: view.price,
            color: view.colors.find(item => item.id === color),
            quantity: 1
        }
        dispatch(addItem(newItem))
    }

    useEffect(() => {
        if(variants) {
            setView(variants[0])
        }
    }, [variants])

    useEffect(() => {
        if(view.colors.length > 0) {
            setColor(view.colors[0].id)
        }
    }, [view])

    return (
        <div className="product-view">
            <div className="product-view__title">{view.title}</div>
            <div className="product-view__content">

                <div className="product-view__content__right">
                    {
                        images ? (
                            <SlickCarousel
                                data={images}
                                dots={false}
                                arrow={true}
                                asNavFor={true}
                                show={1}
                                responsive={1}
                                product={false}
                            />
                        ) : (<></>)
                    }
                </div>

                <div className="product-view__content__left">

                    <div className="product-view__content__price">
                        {numberWithCommas(view.price)}₫
                    </div>

                    <div className="product-view__content__status">
                        <p>Tình trạng:</p>
                        <span>{view.quantity && Number(view.quantity) > 0 ? "Còn hàng" : ""}</span>
                    </div>

                    <div className="product-view__content__description">
                        <p>Thông tin sản phẩm:</p>
                        <div dangerouslySetInnerHTML={{ __html: view.description }}></div>
                    </div>

                    {
                        variants.length > 1 ? (
                            <div className="product-view__content__variants">
                                {
                                    variants?.map((item, index) => (
                                        <div
                                            className={`product-view__content__variants__item 
                                            ${view.id === item.id ? "active" : ""}`}
                                            key={index}
                                            onClick={() => handleChange(item.id)}

                                        >
                                            <div className="product-view__content__variants__radio">
                                                <input
                                                    type="radio"
                                                    checked={view.id === item.id}
                                                    onChange={() => handleChange(item.slug, item.id)}
                                                />
                                            </div>
                                            <div className="product-view__content__variants__info">
                                                {item.ram} - {item.storage}
                                                <p>{numberWithCommas(item.price)}₫</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <></>
                        )
                    }

                    {
                        view.colors.length > 0 ? (
                            <div className="product-view__content__colors">
                                <p>Màu sắc:</p>
                                {
                                    view.colors.map((item, index) => (
                                        <div 
                                            key={index}
                                            className={`product-view__content__colors__item ${color === item.id ? "active" : ""}`} 
                                            onClick={() => handleChangeColor(item.id)}
                                        >
                                            {item.label}
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <></>
                        )
                    }


                    <div className="product-view__content__btn" onClick={() => addToCart()}>
                        Mua ngay
                        <p>Giao hàng miễn phí hoặc nhận tại shop</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductView