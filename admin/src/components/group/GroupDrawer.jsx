import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Button, Form, Input, Drawer, Checkbox, Row, Col, Spin } from 'antd'
import { openNotification } from '../../redux/slice/notificationSlice'

import groupApi from '../../services/GroupApi'
import { getAllGroups } from '../../redux/group/groupRequest'

const GroupDrawer = (props) => {

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const [isFetching, setIsFetching] = useState(false)

    const handlePostData = async (values) => {
        // console.log(values);
        setIsFetching(true)
        if (props.action === "create") {
            const res = await groupApi.createGroup(values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
                props.onClose()
                await getAllGroups(dispatch)
            } else {
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
            }
        } else {
            const res = await groupApi.updateGroup(props.data.id, values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
                props.onClose()
                await getAllGroups(dispatch)
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
            if(props.data) {
                form.setFieldsValue({
                    title: props.data.title,
                    description: props.data.description,
                    roles: props.data.roles?.map(item => item.role_id)
                })
            }
        }
    }, [props.open])

    return (
        <>
            <Drawer
                title={props.action === "create" ? "Create" : "Update"}
                width={850}
                onClose={props.onClose}
                open={props.open}
                forceRender
                styles={{
                    body: { paddingBottom: 80 },
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
                <Form form={form} id="myForm" onFinish={handlePostData} layout="vertical">
                    {/* GROUP NAME */}
                    <Form.Item label="Group Name:" name="title"
                        rules={[{ required: true, message: 'Please input your group name!' }]}
                    >
                        <Input placeholder="Group name..." />
                    </Form.Item>

                    {/* DESCRIPTION */}
                    <Form.Item label="Description:" name="description"
                        rules={[{ required: true, message: 'Please input your description!' }]}
                    >
                        <Input placeholder="Description..." />
                    </Form.Item>

                    {/* PERMISSION */}
                    <Form.Item label="Permission:" name="roles">
                        <Checkbox.Group>
                            <Row>
                                <Col span={4}>
                                    <Row gutter={[0, 20]} style={{ fontWeight: "bold" }}>
                                        <Col span={24}>Users</Col>
                                        <Col span={24}>Products</Col>
                                        <Col span={24}>Brands</Col>
                                        <Col span={24}>Categories</Col>
                                        <Col span={24}>Attributes</Col>
                                        <Col span={24}>Attributes Values</Col>
                                        <Col span={24}>Groups</Col>
                                        <Col span={24}>Images</Col>
                                        <Col span={24}>Orders</Col>
                                        <Col span={24}>Variants</Col>
                                    </Row>
                                </Col>
                                <Col span={20}>
                                    <Row gutter={[0, 20]} style={{ textTransform: "capitalize" }}>
                                        {props.roles?.map((item, index) => (
                                            <Col span={6} key={index}>
                                                <Checkbox value={item.id}>{item.description}</Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    <Row justify={"end"}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isFetching}
                        >
                            Save Changes
                        </Button>
                    </Row>
                </Form>
            </Drawer>
        </>
    )
}

export default GroupDrawer