import React from 'react'
import { Link } from 'react-router-dom'

import logoBrand from '../../../assets/logo-brand/logo_digital_3_250x.png'

const MobileMenu = (props) => {
    return (
        <div className={`mobile-menu ${props.open ? "active" : ""}`}>
            <div className="mobile-menu__top">
                <div className="mobile-menu__top__brand">
                    <img src={logoBrand} alt="" />
                </div>
                <div 
                    className="mobile-menu__top__close" 
                    onClick={() => props.onClose(false)}
                >
                    <i className="fa-solid fa-xmark"></i>
                </div>
            </div>
            <ul>
                {
                    props.categories?.map((item, index) => (
                        <li key={index}>
                            <Link 
                                to={`collections/${item.slug}`} 
                                onClick={() => props.onClose(false)}
                            >
                                <img src={item.icon} alt="" />
                                <p>{item.label}</p>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default MobileMenu