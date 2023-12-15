import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Space, Button, Form, Input, Drawer, Select } from 'antd'
import { openNotification } from '../../redux/slice/notificationSlice'

import userApi from '../../services/UserApi'
import { getUsersByFilter } from '../../redux/user/userRequest'

const UserDrawer = (props) => {

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const location = useLocation()
    let [searchParams, setSearchParams] = useSearchParams();

    const [isFetching, setIsFetching] = useState(false)

    const checkSearchParams = (id) => {
        const params = searchParams.get("group")
        if(Number(params) === id) {
            getUsersByFilter(dispatch, location.search)
        } else {
            setSearchParams({ group: id })
        }
    }

    const handlePostData = async (values) => {
        // console.log(values);
        if(values.password !== values.confirmPassword) {
            dispatch(openNotification(
                { type: "error", message: "Password and confirm password is not the same!", duration: 2, open: true }
            ))
            return
        }

        setIsFetching(true)
        if (props.action === "create") {
            const res = await userApi.createUser(values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                checkSearchParams(values.group_id)
                setIsFetching(false)
                props.onClose()
            } else {
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
            }
        } else {
            const res = await userApi.updateUser(props.data.id, values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                checkSearchParams(values.group_id)
                setIsFetching(false)
                props.onClose()
            } else {
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
            }
        }
    }

    useEffect(() => {
        if (props.action === "create") {
            form.resetFields()
        } else {
            if (props.data) {
                const { group_id, username, email, phone, address } = props.data
                form.setFieldsValue({
                    group_id: group_id,
                    username: username,
                    email: email,
                    phone: phone,
                    address: address,
                    password: null,
                    confirmPassword: null
                })
            }
        }
    }, [props.open])

    return (
        <Drawer
            title={props.action === "create" ? "Create" : "Update"}
            width={720}
            onClose={props.onClose}
            open={props.open}
            forceRender
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
            extra={
                <Space>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        form="myForm"
                        key="submit"
                        htmlType="submit"
                        loading={isFetching}
                    >
                        Save Changes
                    </Button>
                </Space>
            }
        >
            <Form 
                form={form} 
                id="myForm" 
                onFinish={handlePostData} 
                layout="vertical"
            >
                {/* GROUPS */}
                <Form.Item
                    label="Groups:"
                    name="group_id"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}
                >
                    <Select
                        placeholder="Select Groups..."
                        options={props.groups}
                        style={{ textTransform: "capitalize" }}
                    />
                </Form.Item>

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
                    label="Password:"
                    name="password"
                    rules={props.action === "update" ? null : [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Password..." />
                </Form.Item>

                {/* CONFIRM PASSWORD */}
                <Form.Item
                    label="Confirm password:"
                    name="confirmPassword"
                    rules={props.action === "update" ? null : [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Re-enter Password..." />
                </Form.Item>

            </Form>
        </Drawer>
    )
}

export default UserDrawer