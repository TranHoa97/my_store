import React from 'react'
import { Link } from 'react-router-dom'

const BreadCrumb = (props) => {

  const { collections, title } = props

  return (
    <div className="breadcrumb">
      <div className="breadcrumb__item">
        <Link to={"/"}>Trang chủ</Link>
      </div>
      {
        collections ? (
          <div className="breadcrumb__item">
            <span>/</span>
            <Link to={`/collections/${collections.slug}`}>
              {collections.label}
            </Link>
          </div>
        ) : (<></>)
      }

      {
        title ? (
          <div className="breadcrumb__item">
            <span>/</span>
            {title}
          </div>
        ) : (<></>)
      }
    </div>
  )
}

export default BreadCrumb