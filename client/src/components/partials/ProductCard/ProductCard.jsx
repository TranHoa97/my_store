import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import numberWithCommas from '../../../utils/numberWithCommas';

const ProductCard = (props) => {

    const { thumbnail, variants, category, slug } = props.data

    const [changeVariants, setChangeVariants] = useState(variants[0])

    const handleChange = (value) => {
        setChangeVariants(value)
    }

    useEffect(() => {
        handleChange(variants[0])
    }, [variants])

    return (
        <div className="product-card">
            <div className="product-card__image">
                <Link to={`/collections/${category}/${slug}`} onClick={() => window.scrollTo(0,0)}>
                    <img src={thumbnail} alt="" />
                </Link>
            </div>

            {
                !props.variants ? (
                    <div>
                        <div className="product-card__title">
                            <Link to={`/collections/${category}/${slug}`} onClick={() => window.scrollTo(0,0)}>
                                {variants.title}
                            </Link>
                        </div>
                        <div className="product-card__price">
                            {numberWithCommas(variants.price)} ₫
                        </div>
                        <div className="product-card__info">
                            {
                                variants.cpu ? (
                                    <span>
                                        <i className="fa-solid fa-microchip"></i>
                                        {variants.cpu}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                variants.display ? (
                                    <span>
                                        <i className="fa-solid fa-display"></i>
                                        {variants.display}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                variants.ram ? (
                                    <span>
                                        <i className="fa-solid fa-memory"></i>
                                        {variants.ram}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                variants.storage ? (
                                    <span>
                                        <i className="fa-solid fa-hard-drive"></i>
                                        {variants.storage}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                variants.graphics ? (
                                    <span>
                                        <i className="fa-solid fa-laptop"></i>
                                        {variants.graphics}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                variants.weight ? (
                                    <span>
                                        <i className="fa-solid fa-weight-hanging"></i>
                                        {variants.weight}
                                    </span>
                                ) : (<></>)
                            }
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="product-card__title">
                            <Link to={`/collections/${category}/${slug}`} onClick={() => window.scrollTo(0,0)}>
                                {changeVariants.title}
                            </Link>
                        </div>
                        <div className="product-card__variants">
                            {
                                variants.length > 1 && variants.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`product-card__variants__item 
                                        ${changeVariants.id === item.id ? "active" : ""}`}
                                        onClick={() => handleChange(item)}
                                    >
                                        {variants.length > 1 ? item.storage : ""}
                                    </div>
                                ))
                            }
                        </div>
                        <div className="product-card__price">
                            {numberWithCommas(changeVariants.price)} ₫
                        </div>
                        <div className="product-card__info">
                            {
                                changeVariants && changeVariants.cpu ? (
                                    <span>
                                        <i className="fa-solid fa-microchip"></i>
                                        {changeVariants.cpu}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                changeVariants && changeVariants.display ? (
                                    <span>
                                        <i className="fa-solid fa-display"></i>
                                        {changeVariants.display}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                changeVariants && changeVariants.ram ? (
                                    <span>
                                        <i className="fa-solid fa-memory"></i>
                                        {changeVariants.ram}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                changeVariants && changeVariants.storage ? (
                                    <span>
                                        <i className="fa-solid fa-hard-drive"></i>
                                        {changeVariants.storage}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                changeVariants && changeVariants.graphics ? (
                                    <span>
                                        <i className="fa-solid fa-laptop"></i>
                                        {changeVariants.graphics}
                                    </span>
                                ) : (<></>)
                            }
                            {
                                changeVariants && changeVariants.weight ? (
                                    <span>
                                        <i className="fa-solid fa-weight-hanging"></i>
                                        {changeVariants.weight}
                                    </span>
                                ) : (<></>)
                            }
                        </div>
                    </div>
                )
            }

            <div className="product-card__btn">
                <Link to={`/collections/${category}/${slug}`} onClick={() => window.scrollTo(0,0)}>
                    mua ngay
                </Link>
            </div>
        </div>
    )
}

export default ProductCard