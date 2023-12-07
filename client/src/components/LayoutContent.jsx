import React, { useEffect } from "react"

import HeaderComponent from "./partials/HeaderComponent/HeaderComponent"
import FooterComponent from "./partials/FooterComponent/FooterComponent"

import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from "../redux/category/categoryRequest"

const LayoutContent = (props) => {

    const dispatch = useDispatch()

    useEffect(() => {
        getCategories(dispatch)
    }, [])

    return (
        <div className="main">
            <HeaderComponent/>
            <div className="container">
                {props.children}
            </div>
            <FooterComponent />
        </div>
    )
}

export default LayoutContent