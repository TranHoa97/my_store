import React, { useEffect, useState } from 'react'
import BreadCrumb from '../../components/partials/BreadCrumb/BreadCrumb'
import { useSelector } from 'react-redux'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import CheckBox from '../../components/partials/CheckBox/CheckBox'
import productApi from '../../services/productApi'
import ProductCard from '../../components/partials/ProductCard/ProductCard'

import noresult from '../../assets/no-result/no-result.png'
import logoBrand from '../../assets/logo-brand/logo_digital_3_250x.png'

const sort = [
    {
        id: 1,
        label: "Bán chạy nhất",
        slug: "ban-chay-nhat"
    },
    {
        id: 2,
        label: "Giá thấp",
        slug: "gia-thap-den-cao"
    },
    {
        id: 3,
        label: "Giá cao",
        slug: "gia-cao-den-thap"
    },
]

const CollectionsPage = () => {

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const sortUrl = searchParams.get("sort")

    const categories = useSelector(state => state.category.value)

    const [filter, setFilter] = useState({
        sort: "ban-chay-nhat"
    })
    const [active, setActive] = useState(false)
    const [sortCurrent, setSortCurrnent] = useState(null)
    const [mobileSidebar, setMobileSidebar] = useState(false)
    const [attributes, setAttributes] = useState(null)
    const [brands, setBrands] = useState(null)
    const [products, setProducts] = useState(null)

    const handleChange = (type, checked, value) => {
        let newFilter = filter
        if (checked) {
            if(type) {
                if(newFilter[type]) {
                    newFilter[type] = [...newFilter[type], value]
                } else {
                    newFilter[type] = [value]
                }
                setFilter(newFilter)
            }
        } else {
            if(type) {
                newFilter[type] = newFilter[type]?.filter(item => item !== value)
                setFilter(newFilter)
            }
        }
        setSearchParams(newFilter)
    }

    const openSort = () => {
        if (active === false) {
            setActive(true)
        } else {
            setActive(false)
        }
    }

    const handleActive = (label, slug) => {
        setSortCurrnent(label)
        setActive(false)
        setFilter({ ...filter, sort: slug})
        setSearchParams({ ...filter, sort: slug })
    }

    const clearFilter = () => {
        setSortCurrnent("Bán chạy nhất")
        setFilter({
            sort: "ban-chay-nhat",
        })
        setSearchParams({})
    }

    const fetchAttributes = async () => {
        const res = await productApi.getAttributes(params.category)
        if (res.st === 1) {
            setAttributes(res.data)
        } else {
            setAttributes([])
        }
    }

    const fetchBrands = async () => {
        const res = await productApi.getBrands(params.category)
        if (res.st === 1) {
            setBrands(res.data)
        } else {
            setBrands([])
        }
    }

    const fetchProducts = async (category, limit, query) => {
        const res = await productApi.getCollections(category, limit, query)
        if (res.st === 1) {
            setProducts(res.data)
            setFilter(res.filter)
        } else {
            setProducts([])
        }
    }

    useEffect(() => {
        const sortUrl = searchParams.get("sort")
        if (!sortUrl) {
            fetchProducts(params.category, 9, `?sort=ban-chay-nhat`)
            setSortCurrnent("Bán chạy nhất")
        } else {
            fetchProducts(params.category, 9, location.search)
            setSortCurrnent(() => {
                const currentSort = sort.find(item => item.slug === sortUrl)
                return currentSort.label
            })
        }
    }, [searchParams])

    useEffect(() => {
        fetchAttributes()
        fetchBrands()
    }, [params.category])

    return (
        <>
            <section>
                <div className="wrapper">
                    <BreadCrumb
                        collections={categories?.find(item => item.slug === params.category)}
                    />
                </div>
            </section>

            <section>
                <div className="wrapper">
                    <div className="collections">

                        <div className={`collections__mobile-sidebar ${mobileSidebar ? "active" : ""}`}>
                            <div className="collections__sidebar">

                                <div className="collections__mobile-sidebar__top">
                                    <div className="collections__mobile-sidebar__top__brand">
                                        <img src={logoBrand} alt="" />
                                    </div>
                                    <div 
                                        className="collections__mobile-sidebar__top__close"
                                        onClick={() => setMobileSidebar(false)}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </div>
                                </div>

                                {/* Brand */}
                                <div className="collections__sidebar__filter">
                                    <div className="collections__sidebar__filter__title">
                                        Hãng sản xuất
                                    </div>
                                    <div className="collections__sidebar__filter__select">
                                        {brands && brands.map((item, index) => (
                                            <div className="collections__sidebar__filter__select__item" key={index}>
                                                <CheckBox
                                                    label={item.label}
                                                    checked={filter.brand?.includes(item.slug)}
                                                    onChange={(input) => handleChange("brand", input.checked, item.slug)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {
                                    attributes && attributes.map((item, index) => (
                                        <div className="collections__sidebar__filter" key={index}>
                                            <div className="collections__sidebar__filter__title">
                                                {item.label}
                                            </div>
                                            <div className="collections__sidebar__filter__select">
                                                {item.value && item.value.map((e, i) => (
                                                    <div className="collections__sidebar__filter__select__item" key={i}>
                                                        <CheckBox
                                                            label={e.label}
                                                            checked={filter[item.label]?.includes(e.slug)}
                                                            onChange={(input) => handleChange(item.label, input.checked, e.slug)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }

                                {/* Clear Filter */}
                                <div className="collections__sidebar__filter">
                                    <div
                                        className="collections__sidebar__btn"
                                        onClick={clearFilter}
                                    >
                                        <button>Xóa bộ lọc</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div 
                                className='collections__mobile-sidebar__over'
                                onClick={() => setMobileSidebar(false)}
                            ></div>

                        </div>

                        <div className="collections__content">
                            <div className="collections__content__sort">
                                <p>Sắp xếp theo:</p>
                                <div className="collections__content__sort__dropdown">
                                    <div
                                        className="collections__content__sort__dropdown__button"
                                        onClick={openSort}
                                    >
                                        {sortCurrent}
                                        <i className="fa-solid fa-caret-down"></i>
                                    </div>
                                    <div className="collections__content__sort__dropdown__menu">
                                        <ul className={active ? "active" : ""}>
                                            {
                                                sort.map((item, index) => (
                                                    <li
                                                        className={sortCurrent === item.label ? "active" : ""}
                                                        key={index}
                                                        onClick={() => handleActive(item.label, item.slug)}
                                                    >
                                                        {item.label}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div 
                                    className="collections__content__sort__filter"
                                    onClick={() => setMobileSidebar(true)}
                                >
                                    Tính năng <i className="fa-solid fa-filter"></i>
                                </div>
                            </div>

                            <div className="collections__content__box">
                                {
                                    products && products.map((item, index) => (
                                        <div className="collections__content__item" key={index}>
                                            <ProductCard data={item} variants={true} />
                                        </div>
                                    ))
                                }
                            </div>

                            {
                                products && products.length === 0 ? (
                                    <div className="collections__content__no-results">
                                        <div><img src={noresult} alt="" /></div>
                                        <p>Không tìm thấy sản phẩm phù hợp</p>
                                        <div>Vui lòng điều chỉnh lại bộ lọc</div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CollectionsPage