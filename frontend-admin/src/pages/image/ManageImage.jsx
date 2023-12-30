import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Button, Table, Row, Modal, Typography, Col, Input } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { debounce } from "lodash";

import { getImagesByFilter } from '../../redux/image/imageRequest'
import ImageDrawer from '../../components/image/ImageDrawer'
import imageApi from '../../services/ImageApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const ManageImage = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  let [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page")
  const search = searchParams.get("search")

  const loading = useSelector(state => state.image.isFetching)
  const images = useSelector(state => state.image.value?.data)?.map((item, index) => {
    return { ...item, key: index + 1 }
  })
  const pagination = useSelector(state => state.image.value?.pagination)
  const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [action, setAction] = useState(null)
  const [isFetching, setIsFetching] = useState(null)
  const [updateData, setUpdateData] = useState(null)
  const [filter, setFilter] = useState({
    page: page ? +page : 1,
    limit: 4
  })

  const columns = [
    {
      title: 'ProId',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
    },
    {
      title: 'Image',
      dataIndex: 'url',
      key: 'url',
      render: (thumb) => <div><img style={{ width: "60px" }} src={thumb ? thumb : ""} /></div>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showDrawer("update", record)}>Update</a>
          <a onClick={() => showModal(record)}>Delete</a>
        </Space>
      ),
    },
  ]

  const showDrawer = (action, record) => {
    const checkPermissionCreate = account.find(item => item.url === "/images/create")
    const checkPermissionUpdate = account.find(item => item.url === "/images/update")
    if (checkPermissionCreate) {
      setIsDrawerOpen(true)
      setAction(action)
    } else {
      navigate(`/error/403`)
    }
    if (checkPermissionUpdate) {
      setIsDrawerOpen(true)
      setAction(action)
      setUpdateData(record)
    } else {
      navigate(`/error/403`)
    }
  }

  const showModal = (record) => {
    const checkPermissionDelete = account.find(item => item.url === "/images/delete")
    if (checkPermissionDelete) {
      setIsModalOpen(true);
      setUpdateData(record)
    } else {
      navigate(`/error/403`)
    }
  }

  const handleChange = debounce((type, e) => {
    // console.log(e);
    let newFilter = filter
    switch (type) {
      case "pagination":
        setFilter({ ...filter, page: e })
        newFilter = { ...filter, page: e }
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
      setIsFetching(true)
      const res = await imageApi.deleteImage(updateData.id, updateData.title)
      if (res.st === 1) {
        setIsFetching(false)
        setIsModalOpen(false)
        dispatch(openNotification(
          { type: "success", message: res.msg, duration: 2, open: true }
        ))
        if (+page === 1) {
          getImagesByFilter(dispatch, `?page=1&limit=${filter.limit}`)
        } else {
          setSearchParams({ page: 1, limit: filter.limit })
        }
      } else {
        setIsFetching(false)
        setIsModalOpen(false)
        dispatch(openNotification(
          { type: "error", message: res.msg, duration: 2, open: true }
        ))
      }
    } catch (err) {
      setIsFetching(false)
      setIsModalOpen(false)
      dispatch(openNotification(
        { type: "error", message: "Something wrong!", duration: 2, open: true }
      ))
    }
  }

  useEffect(() => {
    dispatch(setMenu(["13"]))
  }, [])

  useEffect(() => {
    if (location.search) {
      getImagesByFilter(dispatch, location.search)
    } else {
      getImagesByFilter(dispatch, `?page=1&limit=${filter.limit}`)
    }
  }, [searchParams])

  return (
    <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
      <Row justify={"space-between"}>
        <Typography.Title level={3}>Manage Images</Typography.Title>
        <Space size={"middle"}>
          <Button
            icon={<RedoOutlined />}
            onClick={() => getImagesByFilter(dispatch, location.search ? location.search : `?page=1&limit=${filter.limit}`)}
          >
            Refresh
          </Button>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => showDrawer("create")}
          >
            Add new
          </Button>
        </Space>
      </Row>
      <Row justify={"end"}>
        <Col span={12}>
          <Input.Search
            placeholder="input search product id, name, slug..."
            onChange={(e) => handleChange("search", e)}
            defaultValue={search}
            allowClear
            enterButton
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={images}
        loading={loading}
        pagination={{
          pageSize: filter.limit ? filter.limit : 4,
          current: page ? +page : 1,
          total: pagination?.total,
          onChange: (e) => handleChange("pagination", e)
        }}
      />

      <ImageDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        action={action}
        data={updateData}
        limit={filter.limit}
      />

      <Modal
        title={"Delete Image"}
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isFetching}
        style={{ top: 20 }}
      >
        <p>Do you want to delete image ?</p>
      </Modal>
    </Space>
  )
}

export default ManageImage