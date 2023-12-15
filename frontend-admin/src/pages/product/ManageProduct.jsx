import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { Space, Col, Button, Table, Row, Input, Select, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import _ from "lodash"
import { debounce } from "lodash";

import { getAllCategories } from '../../redux/category/categoryRequest'
import { getProductsByFilter } from '../../redux/product/productRequest'
import { setMenu } from '../../redux/slice/menuSiderSlice'
import productApi from '../../services/ProductApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { getBrandsByFilter } from '../../redux/brand/brandRequest'
import { getAttributesByFilter } from '../../redux/attributes/attributesRequest'
import UpdateProduct from './UpdateProduct'
import { formatDate } from '../../ultis/formatDate'

const { Search } = Input;

const ManageProduct = () => {

  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  let [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId")
  const search = searchParams.get("search")

  const isFetching = useSelector(state => state.product.isFetching)
  const products = useSelector(state => state.product.value)?.map((item, index) => {
    return { ...item, key: index + 1 }
  })
  const categories = useSelector(state => state.category.value)?.map(item => {
    return { value: item.id, label: item.label }
  })
  const brands = useSelector(state => state.brand.value)?.map((item) => {
    return { value: item.id, label: item.label, category_id: item.category_id }
  })
  const attributes = useSelector(state => state.attributes.attributes.value)
  const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [loading, setLoading] = useState(null)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Product Name',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
    },
    {
      title: 'Image',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumb) => <div><img style={{ width: "80px" }} src={thumb ? thumb : ""} /></div>
    },
    {
      title: 'Variants',
      dataIndex: 'total_variant',
      key: 'total_variant',
      render: (text) => <div>{text}</div>
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      render: (text) => <div>{formatDate(text)}</div>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showUpdate(record)}>Update</a>
          <a onClick={() => showModal(record)}>Delete</a>
          <Link to={`/products/variants/${record.id}`}>Variants</Link>
        </Space>
      ),
    },
  ]

  const showAdd = () => {
    const checkPermission = account.find(item => item.url === "/products/create" || item.url === "/products/update")
    if (checkPermission) {
      navigate(`/products/add`)
    } else {
      navigate(`/error/403`)
    }
  }

  const showUpdate = (record) => {
    const checkPermission = account.find(item => item.url === "/products/create" || item.url === "/products/update")
    if (checkPermission) {
      setIsUpdateOpen(true)
      setUpdateData(record)
    } else {
      navigate(`/error/403`)
    }
  }

  const showModal = (record) => {
    setIsModalOpen(true);
    setUpdateData(record)
  };

  const handleDelete = async () => {
    setLoading(true)
    const res = await productApi.deleteProduct(updateData.id, updateData.thumbname)
    if (res.st === 1) {
      setLoading(false)
      setIsModalOpen(false)
      dispatch(openNotification(
        { type: "success", message: res.msg, duration: 2, open: true }
      ))
      refreshData()
    } else {
      setLoading(false)
      setIsModalOpen(false)
      dispatch(openNotification(
        { type: "error", message: res.msg, duration: 2, open: true }
      ))
    }
  }

  const handleChange = (e) => {
    if (e === "all") {
      if (search) {
        setSearchParams({ search: search })
      } else {
        setSearchParams({})
      }
    } else {
      if (search) {
        setSearchParams({ categoryId: e, search: search })
      } else {
        setSearchParams({ categoryId: e })
      }
    }
  }

  const handleSearch = debounce(async (e) => {
    let keyword = e.target.value.toLowerCase().replaceAll(" ", "-")
    if (categoryId) {
      setSearchParams({ categoryId: categoryId, search: keyword })
    } else {
      setSearchParams({ search: keyword })
    }
  }, 1000)

  const refreshData = () => {
    getProductsByFilter(dispatch, location.search)
  }

  useEffect(() => {
    dispatch(setMenu(["10", "sub3"]))
    getAllCategories(dispatch)
    getBrandsByFilter(dispatch)
    getAttributesByFilter(dispatch)
  }, [])

  useEffect(() => {
    refreshData()
  }, [searchParams])

  return (
    <>
      {
        isUpdateOpen ? (
          <UpdateProduct
            data={updateData}
            categories={categories}
            brands={brands}
            attributes={attributes}
            onClose={() => setIsUpdateOpen(false)}
          />
        ) : (
          <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
              <Typography.Title level={3}>Manage Product</Typography.Title>
              <Space size={"middle"}>
                <Button
                  icon={<RedoOutlined />}
                  onClick={() => refreshData()}
                >
                  Refresh
                </Button>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={showAdd}
                >
                  Add new
                </Button>
              </Space>
            </Row>
            <Row justify={"space-between"}>
              <Col>
                <Row align={"middle"} gutter={[16, 0]}>
                  <Col>Category:</Col>
                  <Select
                    placeholder={`Please Select...`}
                    options={categories ? [...categories, { value: "all", label: "all" }] : []}
                    allowClear
                    onChange={handleChange}
                    value={categoryId ? Number(categoryId) : "all"}
                    style={{ minWidth: "200px", textTransform: "capitalize" }}
                  />
                </Row>
              </Col>
              <Col span={10}>
                <Search
                  placeholder="input search product id, product name..."
                  allowClear
                  onChange={handleSearch}
                  enterButton
                />
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={products}
              pagination={{ pageSize: 4 }}
              loading={isFetching}
            />
            <Modal
              title={"Delete Group"}
              open={isModalOpen}
              onOk={handleDelete}
              onCancel={() => setIsModalOpen(false)}
              style={{ top: 20 }}
              confirmLoading={loading}
            >
              <p>Do you want to delete user ?</p>
            </Modal>
          </Space>
        )
      }
    </>
  )
}

export default ManageProduct