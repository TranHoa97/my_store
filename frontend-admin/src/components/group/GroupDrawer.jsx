import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Space, Button, Form, Input, Drawer, Checkbox, Row, Col, Spin } from 'antd'
import { openNotification } from '../../redux/slice/notificationSlice'

import groupApi from '../../services/GroupApi'
import { getGroupByFilter } from '../../redux/group/groupRequest'

const GroupDrawer = (props) => {

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = searchParams.get("page")

    const roles = useSelector(state => state.roles.value?.data)
    const action = useSelector(state => state.roles.value?.action)

    const [isFetching, setIsFetching] = useState(false)

    const handlePostData = async (values) => {
        // console.log(values);
        try {
            setIsFetching(true)
            if (props.action === "create") {
                const res = await groupApi.createGroup(values)
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    setIsFetching(false)
                    props.onClose()
                    if(+page === 1) {
                        await getGroupByFilter(dispatch, `?page=1&limit=${props.limit}`)
                    } else {
                        setSearchParams({ page: 1, limit: props.limit })
                    }
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
                    await getGroupByFilter(dispatch, location.search ? location.search : `?page=1&limit=${props.limit}`)
                } else {
                    dispatch(openNotification(
                        { type: "error", message: res.msg, duration: 2, open: true }
                    ))
                    setIsFetching(false)
                }
            }
        } catch (err) {
            dispatch(openNotification(
                { type: "error", message: "Something wrong!", duration: 3, open: true }
            ))
            setIsFetching(false)
        }
    }

    useEffect(() => {
        if (props.action === "update" && props.data && props.open) {
            const { label, description, roles } = props.data
            form.setFieldsValue({
                title: label,
                description: description,
                roles: roles?.map(item => item.id ? item.id : "")
            })
        }
        if (props.open === false) {
            form.resetFields()
        }
    }, [props.open])

    return (
        <>
            <Drawer
                title={props.action === "create" ? "Create" : "Update"}
                width={720}
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
                        <Checkbox.Group style={{ display: "flex" }}>
                            <Row>
                                <Col span={24}>
                                    <Row style={{ marginBottom: "20px", textTransform: "capitalize", fontWeight: "bold" }}>
                                        <Col span={4}></Col>
                                        {
                                            action && action.map((item, index) => (
                                                <Col span={5} key={index}>{item}</Col>
                                            ))
                                        }
                                    </Row>
                                    {
                                        roles && roles.map((item, index) => (
                                            <Row
                                                key={index}
                                                justify={"space-between"}
                                                align={"middle"}
                                                style={{ marginBottom: "20px" }}
                                            >
                                                <Col
                                                    span={4}
                                                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                                                >
                                                    {item.manage}
                                                </Col>
                                                {
                                                    item.roles.map(e => (
                                                        <Col span={5} key={e.id}>
                                                            <Checkbox value={e.id}></Checkbox>
                                                        </Col>
                                                    ))
                                                }
                                            </Row>
                                        ))
                                    }
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