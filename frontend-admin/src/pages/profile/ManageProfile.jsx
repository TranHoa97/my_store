import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Button, Row, Modal, Typography, Input, Avatar, Form } from 'antd'
import { EditOutlined, UserOutlined } from '@ant-design/icons'

import { setMenu } from '../../redux/slice/menuSiderSlice'
import { openNotification } from '../../redux/slice/notificationSlice'
import authApi from '../../services/AuthApi'
import { getAccount, logoutUser } from '../../redux/auth/authRequest'
import { useNavigate } from 'react-router-dom'

const ManageProfile = () => {

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.auth.login.value)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false)

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handlePostData = async (values) => {
    if(values.oldPassword && values.newPassword && values.confirmPassword) {
      if (values.newPassword === values.oldPassword) {
        dispatch(openNotification(
          { type: "error", message: "New password and old password must different!", duration: 3, open: true }
        ))
        return
      }
      if (values.newPassword !== values.confirmPassword) {
        dispatch(openNotification(
          { type: "error", message: "New password and confirm password is not same!", duration: 3, open: true }
        ))
        return
      }
    }
    try {
      setIsFetching(true);
      const res = await authApi.updateUser(user.id, values)
      if (res.st === 1) {
        dispatch(openNotification(
          { type: "success", message: res.msg, duration: 3, open: true }
        ))
        setIsFetching(false)
        setIsModalOpen(false)
        if(values.oldPassword) {
          await logoutUser(navigate)
        } else {
          await getAccount(dispatch, user.id)
        }
      } else {
        dispatch(openNotification(
          { type: "error", message: res.msg, duration: 3, open: true }
        ))
        setIsFetching(false)
        setIsModalOpen(false)
      }
    } catch(err) {
      dispatch(openNotification(
        { type: "error", message: "Something wrong!", duration: 3, open: true }
      ))
      setIsFetching(false)
      setIsModalOpen(false)
    }
  };

  useEffect(() => {
    if(isModalOpen) {
      form.resetFields()
    }
    if(user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
      })
    }
  }, [isModalOpen])

  useEffect(() => {
    dispatch(setMenu(["14"]))
  }, [])

  return (
    <Space direction={"vertical"} size={"large"} style={{ width: "100%" }}>
      <Typography.Title level={3}>Profile</Typography.Title>

      <Avatar shape="square" size={200} icon={<UserOutlined />} />

      <Typography.Link onClick={() => showModal()}>
        Thay đổi thông tin <EditOutlined />
      </Typography.Link>

      <Space direction={"vertical"} style={{ width: "100%" }}>
        <Space>
          <Typography.Text strong>Username:</Typography.Text>
          <Typography.Text>{user.username}</Typography.Text>
        </Space>
        <Space>
          <Typography.Text strong>Email:</Typography.Text>
          <Typography.Text>{user.email}</Typography.Text>
        </Space>
        <Space>
          <Typography.Text strong>Address:</Typography.Text>
          <Typography.Text>{user.address}</Typography.Text>
        </Space>
        <Space>
          <Typography.Text strong>Phone:</Typography.Text>
          <Typography.Text>{user.phone}</Typography.Text>
        </Space>
      </Space>

      <Modal
        title='Update'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        style={{ top: 20 }}
        footer={false}
        forceRender
      // confirmLoading={loading}
      >
        <Form
          form={form}
          onFinish={handlePostData}
          layout="vertical"
        >
          {/* USERNAME */}
          <Form.Item
            label="Username:"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input placeholder="Username..." />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            label="Email:"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input placeholder="Email address..." />
          </Form.Item>

          {/* PHONE NUMBER */}
          <Form.Item
            label="Phone number:"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Please input your phone!',
              },
            ]}
          >
            <Input placeholder="Phone number...." />
          </Form.Item>

          {/* ADDRESS */}
          <Form.Item
            label="Address:"
            name="address"
            rules={[
              {
                required: true,
                message: 'Please input your address!',
              },
            ]}
          >
            <Input placeholder="Address..." />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            label="Old Password:"
            name="oldPassword"
          >
            <Input.Password placeholder="Old Password..." />
          </Form.Item>

          {/* NEW PASSWORD */}
          <Form.Item
            label="New Password:"
            name="newPassword"
          >
            <Input.Password placeholder="New Password..." />
          </Form.Item>

          {/* CONFIRM NEW PASSWORD */}
          <Form.Item
            label="Confirm New Password:"
            name="confirmPassword"
          >
            <Input.Password placeholder="Re-enter Password..." />
          </Form.Item>

          <Row justify={"end"}>
            <Button type='primary' htmlType='submit' loading={isFetching}>
              Save Changes
            </Button>
          </Row>
        </Form>
      </Modal>
    </Space>
  )
}

export default ManageProfile