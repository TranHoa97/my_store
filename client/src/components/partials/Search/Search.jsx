import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { debounce } from 'lodash'

import productApi from '../../../services/productApi'
import numberWithCommas from '../../../utils/numberWithCommas'

const Search = (props) => {

    const navigate = useNavigate()

    const [products, setProducts] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        const value = e.target.search.value.replaceAll(" ", "-")
        navigate(`/search?search=${value}`)
        props.setOverSuggest(false)
    }

    const handleChange = debounce((e) => {
        // console.log(e.target.value);
        if (e.target.value) {
            fetchSuggest(`?search=${e.target.value}`)
            props.setOverSuggest(true)
        } else {
            setProducts(null)
            props.setOverSuggest(false)
        }
    }, 500)

    const fetchSuggest = async (value) => {
        const res = await productApi.getProductSearch(value)
        if (res.st === 1) {
            setProducts(res.data)
        } else {
            setProducts([])
        }
    }

    return (
        <div className='search'>
            <form onSubmit={handleSubmit} onChange={handleChange}>
                <input type="text" name='search' placeholder='Nhập tên sản phẩm muốn tìm...' />
                <button type='submit'>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                {
                    props.overSuggest ? (
                        <ul>
                            {
                                products && products.map((item, index) => (
                                    <li key={index}>
                                        <Link 
                                            to={`/collections/${item.category}/${item.variants[0].slug}`}
                                            onClick={() => props.setOverSuggest(false)}
                                        >
                                            <img src={item.thumbnail} alt="" />
                                            <div className="suggest">
                                                <p>{item.title}</p>
                                                <span>Giá: {numberWithCommas(item.variants[0].price)}đ</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    ) : (<></>)
                }
            </form>
        </div>
    )
}

export default Search