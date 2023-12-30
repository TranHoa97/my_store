import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import SlickCarousel from '../../components/partials/SlickCarousel/SlickCarousel'

import bannerSlide from '../../assets/fakeData/bannerSlide'
import bannerAds from '../../assets/fakeData/bannerAds'

import banner1 from "../../assets/banner-home/banner1.webp"
import banner2 from "../../assets/banner-home/banner2.webp"
import banner3 from "../../assets/banner-home/banner3.webp"
import banner4 from "../../assets/banner-home/banner4.webp"

import productApi from '../../services/productApi'
import ProductCard from '../../components/partials/ProductCard/ProductCard'

const HomePage = () => {

  const categories = useSelector(state => state.category.value)

  const [smartphone, setSmartphone] = useState(null)
  const [laptop, setLaptop] = useState(null)
  const [tablet, setTablet] = useState(null)
  const [accessories, setAccessories] = useState(null)

  const fetchData = async (category, limit) => {
    const res = await productApi.getProductsHome(category, limit)
    if (res.st === 1) {
      switch (category) {
        case "dien-thoai":
          setSmartphone(res.data)
          break;
        case "may-tinh-xach-tay":
          setLaptop(res.data)
          break;
        case "may-tinh-bang":
          setTablet(res.data)
          break;
        case "linh-phu-kien":
          setAccessories(res.data)
          break;
      }
    }
  }

  useEffect(() => {
    if (categories) {
      for (let index = 0; index < categories.length; index++) {
        fetchData(categories[index].slug, 4)
      }
    }
  }, [categories])

  return (
    <>
      {/* Slider */}
      <section className='home'>
        <div className="wrapper">
          <div className="home__box">
            <div className="home__slider">
              <div className="home__slider__left">
                <SlickCarousel
                  data={bannerSlide}
                  dots={true}
                  arrow={true}
                  asNavFor={false}
                  show={1}
                  responsive={1}
                />
              </div>
              <div className="home__slider__right">
                {bannerAds.map(item => (
                  <div className='home__slider__right__item' key={item.id}>
                    <Link to={item.slug}>
                      <img src={item.img} alt="" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category */}
      <section className='home'>
        <div className="wrapper">
          <div className="home__box">
            <div className="home__category">
              {
                categories?.map(item => (
                  <div className="home__category__item" key={item.id}>
                    <Link to={`/collections/${item.slug}`} onClick={() => window.scrollTo(0, 0)}>
                      <div className="home__category__item__image">
                        <img src={item.image_url} alt={item.image_name} />
                      </div>
                      <div className="home__category__item__title">{item.label}</div>
                    </Link>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className='home'>
        <div className="wrapper">
          <img src={banner1} alt="" />
        </div>
      </section>

      {/* Hot sale */}
      <section className='home'>
        <div className="wrapper">
          <div className="home__box">
            <div className="home__hotsale">
              <div className="home__hotsale__title">
                <i className="fa-solid fa-fire-flame-curved"></i>
                <span>Khuyến mãi hot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className='home'>
        <div className="wrapper">
          <img src={banner2} alt="" />
        </div>
      </section>

      {/* Smartphone */}
      <section className='home'>
        <div className="wrapper">
          <div className="home__box">
            <div className="home__product">
              <div className="home__product__title">
                <p>điện thoại nổi bật</p>
                <Link to={`/collections/dien-thoai`}>Xem thêm</Link>
              </div>
              <div className="home__product__content">
                {
                  smartphone && smartphone.map(item => (
                    <div key={item.id} className='home__product__content__item'>
                      <ProductCard data={item} />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className='home'>
        <div className="wrapper">
          <img src={banner3} alt="" />
        </div>
      </section>

      {/* Laptop */}
      <section className='home'>
        <div className="wrapper">
          <div className="home__box">
            <div className="home__product">
              <div className="home__product__title">
                <p>Laptop nổi bật</p>
                <Link to={`/collections/may-tinh-xach-tay`}>Xem thêm</Link>
              </div>
              <div className="home__product__content">
                {
                  laptop && laptop.map(item => (
                    <div key={item.id} className='home__product__content__item'>
                      <ProductCard data={item} />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className='home'>
        <div className="wrapper">
          <img src={banner4} alt="" />
        </div>
      </section>

      {/* Tablet */}
      <section className='home'>
        <div className="wrapper">
          <div className="home__box">
            <div className="home__product">
              <div className="home__product__title">
                <p>Tablet nổi bật</p>
                <Link to={`/collections/may-tinh-bang`}>Xem thêm</Link>
              </div>
              <div className="home__product__content">
                {
                  tablet && tablet.map(item => (
                    <div key={item.id} className='home__product__content__item'>
                      <ProductCard data={item} />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className='home'>
        <div className="wrapper">
          <img src={banner4} alt="" />
        </div>
      </section>

      {/* Accessories */}
      <section className='home'>
        <div className="wrapper">
          <div className="home__box">
            <div className="home__product">
              <div className="home__product__title">
                <p>Phụ kiện nổi bật</p>
                <Link to={`/collections/linh-phu-kien`}>Xem thêm</Link>
              </div>
              <div className="home__product__content">
                {
                  accessories && accessories.map(item => (
                    <div key={item.id} className='home__product__content__item'>
                      <ProductCard data={item} />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default HomePage