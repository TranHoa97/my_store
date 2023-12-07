import React, { useEffect, useRef } from 'react'
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

    const { slide, product, dots, mainSlideArrow, subSlideArrow, asNavFor, mainShow, responsive } = props
    const mainSlider = useRef(null)
    const subSlider = useRef(null)

    let mainSettings = {
        dots: dots,
        infinite: true,
        speed: 500,
        slidesToShow: mainShow ? mainShow : 1,
        slidesToScroll: 1,
        arrows: mainSlideArrow,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: responsive ? responsive : 2,
                slidesToScroll: 1,
                infinite: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: responsive ? responsive : 1,
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
        arrows: subSlideArrow,
        swipeToSlide: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    }

    useEffect(() => {
        if(props.data) {
            console.log(props.data);
        }
    }, [])

    return (
        <div className="slick-carousel">
            <div className="slick-carousel__main">
                <Slider
                    {...mainSettings}
                    asNavFor={subSlider.current}
                    ref={mainSlider}
                >
                    {
                        slide && slide.map((item,index) => (
                            <div className="slick-carousel__main__item" key={index}>
                                <img src={item.url || item.thumbnail} alt="" />
                            </div>
                        ))
                    }
                    {
                        product && product.map((item, index) => (
                            <div className="slick-carousel__main__item" key={index}>
                                <ProductCard data={item} variants={false}/>
                            </div>
                        ))
                    }
                </Slider>
            </div>

            {
                asNavFor && asNavFor ? (
                    <div className="slick-carousel__sub">
                        <Slider
                            {...subSettings}
                            asNavFor={mainSlider.current}
                            ref={subSlider}
                            focusOnSelect={true}
                        >
                            {
                                slide && slide.map((item,index) => (
                                    <div className="slick-carousel__sub__item" key={index}>
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