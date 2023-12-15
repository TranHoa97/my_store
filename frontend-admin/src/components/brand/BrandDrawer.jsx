import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Space, Button, Form, Input, Drawer, Select } from 'antd'

import { openNotification } from '../../redux/slice/notificationSlice'
import brandApi from '../../services/BrandApi'
import { getBrandsByFilter } from '../../redux/brand/brandRequest'

const BrandDrawer = (props) => {

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const location = useLocation()
    let [searchParams, setSearchParams] = useSearchParams();

    const [isFetching, setIsFetching] = useState(false)

    const checkSearchParams = (id) => {
        const params = searchParams.get("category")
        if(Number(params) === id) {
            getBrandsByFilter(dispatch, location.search)
        } else {
            setSearchParams({ category: id })
        }
    }

    const handlePostData = async (values) => {
        // console.log(values);
        setIsFetching(true)
        if (props.action === "create") {
            const res = await brandApi.createBrand(values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                checkSearchParams(values.category_id)
                setIsFetching(false)
                props.onClose()
            } else {
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
            }
        } else {
            const res = await brandApi.updateBrand(props.data.id, values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                checkSearchParams(values.category_id)
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
                form.setFieldsValue({
                    label: props.data.label,
                    slug: props.data.slug,
                    category_id: props.data.category_id
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
                    label="Brand Name:"
                    name="label"
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
                    label="Slug:"
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
                        options={props.category}
                        placeholder="Please select..."
                    />
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default BrandDrawer