import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import numberWithCommas from '../../../utils/numberWithCommas';

const ProductCard = (props) => {

    const { thumbnail, variants, category_slug, slug, title } = props.data

    const [changeVariants, setChangeVariants] = useState(null)

    useEffect(() => {
        if(variants && variants.length > 0) {
            setChangeVariants(variants[0])
        }
    }, [variants])

    return (
        <div className="product-card">
            <div className="product-card__image">
                <Link to={`/collections/${category_slug}/${slug}`} onClick={() => window.scrollTo(0, 0)}>
                    <img src={thumbnail} alt="" />
                </Link>
            </div>

            {
                !props.variants ? (
                    <div>
                        <div className="product-card__title">
                            <Link to={`/collections/${category_slug}/${slug}`} onClick={() => window.scrollTo(0, 0)}>
                                {title}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="product-card__title">
                            <Link to={`/collections/${category_slug}/${slug}`} onClick={() => window.scrollTo(0, 0)}>
                                {changeVariants?.title}
                            </Link>
                        </div>
                        <div className="product-card__variants">
                            {
                                variants.length > 1 && variants.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`product-card__variants__item 
                                        ${changeVariants?.id === item.id ? "active" : ""}`}
                                        onClick={() => setChangeVariants(item)}
                                    >
                                        {variants.length > 1 ? item.storage : ""}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
            <div className="product-card__price">
                {numberWithCommas(Number(changeVariants?.price))} ₫
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

            <div className="product-card__btn">
                <Link to={`/collections/${category_slug}/${slug}`} onClick={() => window.scrollTo(0, 0)}>
                    mua ngay
                </Link>
            </div>
        </div>
    )
}

export default ProductCard