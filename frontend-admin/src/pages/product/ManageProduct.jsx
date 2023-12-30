import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { Space, Col, Button, Table, Row, Input, Select, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { debounce } from "lodash";

import { getCategoryByFilter } from '../../redux/category/categoryRequest'
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
  let [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get("category")
  const page = searchParams.get("page")
  const search = searchParams.get("search")

  const isFetching = useSelector(state => state.product.isFetching)
  const products = useSelector(state => state.product.value)?.data.map((item, index) => {
    return { ...item, key: index + 1 }
  })
  const categories = useSelector(state => state.category.value)?.data.map(item => {
    return { value: item.id, label: item.label }
  })
  const brands = useSelector(state => state.brand.value)?.data.map((item) => {
    return { value: item.id, label: item.label, category_id: item.category_id }
  })
  const attributes = useSelector(state => state.attributes.attributes.value?.data)
  const pagination = useSelector(state => state.product.value)?.pagination
  const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [loading, setLoading] = useState(null)
  const [filter, setFilter] = useState({
    page: page ? +page : 1,
    limit: 4,
  })

  const columns = [
    {
      title: 'ProId',
      dataIndex: 'id',
      key: 'id',
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
      render: (thumb) => <div><img style={{ width: "50px" }} src={thumb ? thumb : ""} /></div>
    },
    {
      title: 'Category',
      dataIndex: 'category_label',
      key: 'category_label',
      render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
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
    const checkPermission = account.find(item => item.url === "/products/create")
    if (checkPermission) {
      navigate(`/products/add`)
    } else {
      navigate(`/error/403`)
    }
  }

  const showUpdate = (record) => {
    const checkPermission = account.find(item => item.url === "/products/update")
    if (checkPermission) {
      setIsUpdateOpen(true)
      setUpdateData(record)
    } else {
      navigate(`/error/403`)
    }
  }

  const showModal = (record) => {
    const checkPermissionDelete = account.find(item => item.url === "/products/delete")
    if (checkPermissionDelete) {
      setIsModalOpen(true);
      setUpdateData(record)
    } else {
      navigate(`/error/403`)
    }
  };

  const handleChange = debounce((type, e) => {
    // console.log(e);
    let newFilter = {}
    switch (type) {
      case "pagination":
        if(category) {
          setFilter({ ...filter, category: category, page: e })
          newFilter = { ...filter, category: category, page: e }
        } else {
          setFilter({ ...filter, page: e })
          newFilter = { ...filter, page: e }
        }
        break;
      case "category":
        if (e === "all") {
          let { category, ...others } = filter
          setFilter({ ...others, page: 1 })
          newFilter = { ...others, page: 1 }
        } else {
          setFilter({ ...filter, page: 1, category: e })
          newFilter = { ...filter, page: 1, category: e }
        }
        break;
      case "search":
        let keyword = e.target.value
        if (keyword) {
          setFilter({ ...filter, page: 1, search: keyword })
          newFilter = { ...filter, page: 1, search: keyword }
        } else {
          let { search, ...others } = filter
          setFilter({ ...others, page: 1 })
          newFilter = { ...others, page: 1 }
        }
        break;
    }
    setSearchParams(newFilter)
  }, 500)

  const handleDelete = async () => {
    try {
      setLoading(true)
      const res = await productApi.deleteProduct(updateData.id, updateData.thumbname)
      if (res.st === 1) {
        setLoading(false)
        setIsModalOpen(false)
        dispatch(openNotification(
          { type: "success", message: res.msg, duration: 2, open: true }
        ))
        if (updateData.category_id === +category) {
          getProductsByFilter(dispatch, `?page=1&limit=${filter.limit}&category=${updateData.category_id}`)
        } else {
          setSearchParams({ page: 1, limit: filter.limit, category: updateData.category_id })
        }
      } else {
        setLoading(false)
        setIsModalOpen(false)
        dispatch(openNotification(
          { type: "error", message: res.msg, duration: 2, open: true }
        ))
      }
    } catch (err) {
      setLoading(false)
      setIsModalOpen(false)
      dispatch(openNotification(
        { type: "error", message: "Something wrong!", duration: 2, open: true }
      ))
    }
  }

  useEffect(() => {
    dispatch(setMenu(["10", "sub3"]))
    getCategoryByFilter(dispatch)
    getBrandsByFilter(dispatch)
    getAttributesByFilter(dispatch)
  }, [])

  useEffect(() => {
    if (location.search) {
      getProductsByFilter(dispatch, location.search)
    } else {
      getProductsByFilter(dispatch, `?page=1&limit=${filter.limit}`)
    }
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
            limit={filter.limit}
          />
        ) : (
          <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
              <Typography.Title level={3}>Manage Product</Typography.Title>
              <Space size={"middle"}>
                <Button
                  icon={<RedoOutlined />}
                  onClick={() => getProductsByFilter(dispatch, location.search ? location.search : `?page=1&limit=${filter.limit}`)}
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
                    onChange={(e) => handleChange("category", e)}
                    value={category ? +category : "all"}
                    style={{ minWidth: "200px", textTransform: "capitalize" }}
                    allowClear
                  />
                </Row>
              </Col>
              <Col span={12}>
                <Search
                  placeholder="input search product name, slug, id..."
                  onChange={(e) => handleChange("search", e)}
                  defaultValue={search}
                  allowClear
                  enterButton
                />
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={products}
              loading={isFetching}
              pagination={{
                pageSize: filter.limit ? filter.limit : 8,
                current: page ? +page : 1,
                total: pagination?.total,
                onChange: (e) => handleChange("pagination", e)
              }}
            />
            <Modal
              title={"Delete Group"}
              style={{ top: 20 }}
              open={isModalOpen}
              onOk={handleDelete}
              onCancel={() => setIsModalOpen(false)}
              confirmLoading={loading}
            >
              <p>Do you want to delete product ?</p>
            </Modal>
          </Space>
        )
      }
    </>
  )
}

export default ManageProduct