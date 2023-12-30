import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import ProductCard from '../ProductCard/ProductCard';

function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <div
            className={`slick-carousel__nextBtn`}
            onClick={onClick}
        >
            <i className="fa-solid fa-chevron-right"></i>
        </div>
    );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <div
            className={`slick-carousel__prevBtn`}
            onClick={onClick}
        >
            <i className="fa-solid fa-chevron-left"></i>
        </div>
    );
}

const SlickCarousel = (props) => {

    const { data, arrow, responsive, asNavFor, dots, show, product } = props

    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();

    let mainSettings = {
        dots: dots,
        infinite: true,
        speed: 500,
        slidesToShow: show || 1,
        slidesToScroll: 1,
        arrows: arrow || true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: responsive || 2,
                    slidesToScroll: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: responsive || 1,
                    slidesToScroll: 1,
                    infinite: true
                }
            }
        ]
    }

    let subSettings = {
        dots: dots,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: arrow || true,
        swipeToSlide: true,
        focusOnSelect: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    }

    return (
        <div className="slick-carousel">
            <div className="slick-carousel__main">
                <Slider
                    {...mainSettings}
                    asNavFor={nav2} 
                    ref={(slider1) => setNav1(slider1)}
                >
                    {
                        data && data.map((item) => (
                            <div className="slick-carousel__main__item" key={item.id}>
                                {
                                    product ? (
                                        <ProductCard data={item} />
                                    ) : (
                                        <img src={item.url || item.thumbnail} alt="" />
                                    )
                                }
                            </div>
                        ))
                    }
                </Slider>
            </div>

            {
                asNavFor ? (
                    <div className="slick-carousel__sub">
                        <Slider
                            {...subSettings}
                            asNavFor={nav1}
                            ref={(slider2) => setNav2(slider2)}
                        >
                            {
                                data && data.map((item) => (
                                    <div className="slick-carousel__sub__item" key={item.id}>
                                        <img src={item.url} alt="" />
                                    </div>
                                ))
                            }
                        </Slider>
                    </div>
                ) : (<></>)
            }
        </div>
    )
}

export default SlickCarousel