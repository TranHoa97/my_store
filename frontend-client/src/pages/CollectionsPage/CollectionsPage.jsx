import React, { useEffect, useState } from 'react'
import BreadCrumb from '../../components/partials/BreadCrumb/BreadCrumb'
import { useSelector } from 'react-redux'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import ReactPaginate from 'react-paginate';

import CheckBox from '../../components/partials/CheckBox/CheckBox'
import productApi from '../../services/productApi'
import ProductCard from '../../components/partials/ProductCard/ProductCard'

import noresult from '../../assets/no-result/no-result.png'
import logoBrand from '../../assets/logo-brand/logo_digital_3_250x.png'

const sorts = [
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
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()

    const categories = useSelector(state => state.category.value)

    const [activeSort, setActiveSort] = useState(false)
    const [mobileSidebar, setMobileSidebar] = useState(false)
    const [attributes, setAttributes] = useState(null)
    const [brands, setBrands] = useState(null)
    const [products, setProducts] = useState(null)
    const [totalPage, setTotalPage] = useState(null)
    const [filter, setFilter] = useState({
        brand: [],
        sort: "ban-chay-nhat",
        page: 1,
        limit: 6
    })

    const handleChange = (type, checked, value) => {
        let newFilter = filter
        if (checked) {
            if (type) {
                if (newFilter[type]) {
                    newFilter[type] = [...newFilter[type], value]
                } else {
                    newFilter[type] = [value]
                }
                setFilter(newFilter)
            }
        } else {
            if (type) {
                newFilter[type] = newFilter[type]?.filter(item => item !== value)
                setFilter(newFilter)
            }
        }
        setSearchParams({...newFilter, page: 1})
    }

    const handleActiveSort = (value) => {
        setActiveSort(false)
        setFilter({ ...filter, sort: value.slug, page: 1 })
        setSearchParams({ ...filter, sort: value.slug, page: 1 })
    }

    const clearFilter = () => {
        setFilter({
            brand: [],
            sort: sorts[0],
            page: 1,
            limit: 6
        })
        setSearchParams({})
    }

    const handlePageClick = (event) => {
        setFilter({...filter, page: event.selected + 1})
        setSearchParams({...filter, page: event.selected + 1}) 
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

    const fetchProducts = async (category, query) => {
        const res = await productApi.getCollections(category, query)
        if (res.st === 1) {
            setProducts(res.data)
            setTotalPage(res.filter.total_page)
            let {total_page, ...others} = res.filter
            setFilter(others)
        } else {
            setProducts([])
        }
    }

    useEffect(() => {
        if(location.search) {
            fetchProducts(params.category, location.search)
        } else {
            fetchProducts(params.category, `?sort=${filter.sort}&page=1&limit=${filter.limit}`)
        }
    }, [location])

    useEffect(() => {
        fetchAttributes()
        fetchBrands()
    }, [params.category])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
                                            <div className="collections__sidebar__filter__select__item brand" key={index}>
                                                <CheckBox
                                                    label={item.label}
                                                    checked={filter.brand?.includes(item.slug) || false}
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
                                                            checked={filter[item?.label]?.includes(e.slug) || false}
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
                                        onClick={() => activeSort ? setActiveSort(false) : setActiveSort(true)}
                                    >
                                        {sorts.find(item => item.slug === filter.sort)?.label}
                                        <i className="fa-solid fa-caret-down"></i>
                                    </div>
                                    <div className="collections__content__sort__dropdown__menu">
                                        <ul className={activeSort ? "active" : ""}>
                                            {
                                                sorts.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className={filter.sort === item.slug ? "active" : ""}
                                                        onClick={() => handleActiveSort(item)}
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
                                        <div className="collections__content__box__item" key={index}>
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

                            {
                                products && products.length > 0 ? (
                                    <div className='collections__content__paginate'>
                                        <ReactPaginate
                                            breakLabel="..."
                                            nextLabel="next >"
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={3}
                                            pageCount={totalPage}
                                            forcePage={(parseInt(searchParams.get("page")) || 1) - 1}
                                            previousLabel="< previous"
                                            renderOnZeroPageCount={null}
                                            containerClassName='collections__content__paginate__pagination'
                                            pageClassName="collections__content__paginate__page-item"
                                            pageLinkClassName="collections__content__paginate__page-link"
                                            breakClassName="collections__content__paginate__page-item"
                                            breakLinkClassName="collections__content__paginate__page-link"
                                            previousClassName="collections__content__paginate__page-item"
                                            previousLinkClassName="collections__content__paginate__page-link"
                                            nextClassName="collections__content__paginate__page-item"
                                            nextLinkClassName="collections__content__paginate__page-link"
                                            activeClassName='collections__content__paginate__active'
                                        />
                                    </div>
                                ) : (<></>)
                            }

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CollectionsPage