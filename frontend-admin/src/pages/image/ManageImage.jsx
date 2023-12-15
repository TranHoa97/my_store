import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Button, Table, Row, Modal, Typography, Col, Input } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import _ from "lodash"
import { debounce } from "lodash";

import { getImagesByFilter } from '../../redux/image/imageRequest'
import ImageDrawer from '../../components/image/ImageDrawer'
import imageApi from '../../services/ImageApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const ManageImage = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  let [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation()

  const loading = useSelector(state => state.image.isFetching)
  const images = useSelector(state => state.image.value)?.map((item, index) => {
    return { ...item, key: index + 1 }
  })
  const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [action, setAction] = useState(null)
  const [isFetching, setIsFetching] = useState(null)
  const [updateData, setUpdateData] = useState(null)

  const columns = [
    {
      title: 'Product Id',
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
      render: (thumb) => <div><img style={{ width: "120px" }} src={thumb ? thumb : ""} /></div>
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
    const checkPermission = account.find(item => item.url === "/images/create" || item.url === "/images/update")
    if (checkPermission) {
      setIsDrawerOpen(true)
      setAction(action)
      setUpdateData(record)
    } else {
      navigate(`/error/403`)
    }
  }

  const showModal = (record) => {
    setIsModalOpen(true)
    setUpdateData(record)
  }

  const handleDelete = async () => {
    setIsFetching(true)
    const res = await imageApi.deleteImage(updateData.id, updateData.title)
    if (res.st === 1) {
      setIsFetching(false)
      setIsModalOpen(false)
      dispatch(openNotification(
        { type: "success", message: res.msg, duration: 2, open: true }
      ))
      await getImagesByFilter(dispatch)
    } else {
      setIsFetching(false)
      setIsModalOpen(false)
      dispatch(openNotification(
        { type: "error", message: res.msg, duration: 2, open: true }
      ))
    }
  }

  const handleSearch = debounce((e) => {
    let keyword = e.target.value.toLowerCase().replaceAll(" ", "-")
    setSearchParams({ search: keyword })
  }, 1000)

  useEffect(() => {
    dispatch(setMenu(["13"]))
  }, [])

  useEffect(() => {
    const checkPermission = account.find(item => item.url === "/images/read")
    if (checkPermission) {
      getImagesByFilter(dispatch, location.search)
    } else {
      navigate(`/error/403`)
    }
  }, [searchParams])

  return (
    <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
      <Row justify={"space-between"}>
        <Typography.Title level={3}>Manage Images</Typography.Title>
        <Space size={"middle"}>
          <Button
            icon={<RedoOutlined />}
            onClick={() => getImagesByFilter(dispatch, location.search)}
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
        <Col span={10}>
          <Input.Search
            placeholder="input search product id...."
            onChange={handleSearch}
            allowClear
            enterButton
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={images}
        pagination={{ pageSize: 6 }}
        loading={loading}
      />

      <ImageDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        action={action}
        data={updateData}
      />

      <Modal
        title={"Delete Image"}
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isFetching}
        style={{ top: 20 }}
      >
        <p>Do you want to delete brand ?</p>
      </Modal>
    </Space>
  )
}

export default ManageImage