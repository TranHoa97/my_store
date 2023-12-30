import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Space, Button, Form, Input, Drawer, Select } from 'antd'

import { openNotification } from '../../redux/slice/notificationSlice'
import attributesApi from '../../services/AttributesApi'
import { getAttributesByFilter } from '../../redux/attributes/attributesRequest'

const AttributesDrawer = (props) => {

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const location = useLocation()
    let [searchParams, setSearchParams] = useSearchParams();

    const [isFetching, setIsFetching] = useState(false)

    const checkParams = (categoryId) => {
        const params = searchParams.get("category")
        if (+params === categoryId) {
            getAttributesByFilter(dispatch, `?page=1&limit=${props.limit}&category=${categoryId}`)
        } else {
            setSearchParams({
                page: 1,
                limit: props.limit,
                category: categoryId
            })
        }
    }

    const handlePostData = async (values) => {
        // console.log(values);
        try {
            setIsFetching(true)
            if (props.action === "create") {
                const res = await attributesApi.createAttributes(values)
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    setIsFetching(false)
                    props.onClose()
                    checkParams(values.category_id)
                } else {
                    dispatch(openNotification(
                        { type: "error", message: res.msg, duration: 2, open: true }
                    ))
                    setIsFetching(false)
                }
            } else {
                const res = await attributesApi.updateAttributes(props.data.id, values)
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    setIsFetching(false)
                    props.onClose()
                    await getAttributesByFilter(dispatch, location.search ? location.search : `?page=1&limit=${props.limit}`)
                } else {
                    dispatch(openNotification(
                        { type: "error", message: res.msg, duration: 2, open: true }
                    ))
                    setIsFetching(false)
                }
            }
        } catch(err) {
            dispatch(openNotification(
                { type: "error", message: "Something wrong!", duration: 2, open: true }
            ))
            setIsFetching(false)
        }
    }

    useEffect(() => {
        if (props.action === "create") {
            form.resetFields()
        } else {
            if (props.data) {
                const { label, category_id, slug} = props.data
                form.setFieldsValue({
                    title: label,
                    category_id: category_id,
                    slug: slug
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
            <Form form={form} id="myForm" onFinish={handlePostData} layout="vertical">
                {/* label */}
                <Form.Item
                    label="Attributes Name:"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your value!',
                        },
                    ]}
                >
                    <Input placeholder="label..." />
                </Form.Item>

                {/* slug */}
                <Form.Item
                    label="SKU:"
                    name="slug"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your value!',
                        },
                    ]}
                >
                    <Input placeholder="slug..." />
                </Form.Item>

                {/* category */}
                <Form.Item
                    label="Category:"
                    name="category_id"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your value!',
                        },
                    ]}
                >
                    <Select
                        placeholder="Please select..."
                        options={props.category}
                        style={{ textTransform: "capitalize" }}
                    />
                </Form.Item>

            </Form>
        </Drawer>
    )
}

export default AttributesDrawer