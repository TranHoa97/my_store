import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux'
import Search from '../Search/Search'

import logoBrand from '../../../assets/logo-brand/logo_digital_3_250x.png'
import MobileMenu from '../MobileMenu/MobileMenu'

const HeaderComponent = () => {

    const cartItems = useSelector(state => state.cartItems.value)
    const categories = useSelector(state => state.category.value)

    const [totalProducts, setTotalProducts] = useState(0)
    const [overSuggest, setOverSuggest] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)

    useEffect(() => {
        if (cartItems) {
            setTotalProducts(cartItems.reduce((total, item) => total + Number(item.quantity), 0))
        }
    }, [cartItems])

    return (
        <header className="header">
            <div className="header__box">

                <div className="header__top">
                    <div className="wrapper">
                        <div className='header__top__box'>
                            <div className="header__top__menu" onClick={() => setMobileMenu(true)}>
                                <i className="fa-solid fa-bars"></i>
                            </div>
                            <div className="header__top__brand">
                                <Link to={"/"}><img src={logoBrand} alt="logo-brand" /></Link>
                            </div>
                            <div className="header__top__search">
                                <Search
                                    setOverSuggest={setOverSuggest}
                                    overSuggest={overSuggest}
                                />
                            </div>
                            <div className="header__top__hotline">
                                <i className="fa-solid fa-square-phone"></i>
                                <span>+123456789xxx</span>
                            </div>
                            <div className="header__top__cart">
                                <Link to={"/cart"}>
                                    <i className="fa-solid fa-cart-shopping"></i>
                                    <span>Cart({totalProducts})</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="header__nav">
                    <div className="wrapper">
                        <div className="header__nav__box">
                            {
                                categories?.map((item, index) => (
                                    <div className="header__nav__item" key={index}>
                                        <Link to={`/collections/${item.slug}`}>
                                            <img src={item.icon} alt="" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className={`header__menu`}>
                <MobileMenu
                    open={mobileMenu}
                    onClose={() => setMobileMenu(false)}
                    categories={categories}
                />
                <div
                    className={`header__menu__over ${mobileMenu ? "active" : ''}`}
                    onClick={() => setMobileMenu(false)}
                >

                </div>
            </div>

            <div
                className={`${overSuggest ? "over-suggest" : ""}`}
                onClick={() => setOverSuggest(false)}
            ></div>
        </header>
    )
}

export default HeaderComponent