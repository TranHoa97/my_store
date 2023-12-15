import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Space, Button, Form, Input, Drawer } from 'antd'

import categoryApi from '../../services/CategoryApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { getAllCategories } from '../../redux/category/categoryRequest'

const CategoryDrawer = (props) => {

    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const [isFetching, setIsFetching] = useState(false)

    const handlePostData = async (values) => {
        // console.log(values);
        setIsFetching(true)
        if (props.action === "create") {
            const res = await categoryApi.createCateogry(values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                props.onClose()
                setIsFetching(false)
                await getAllCategories(dispatch)
            } else {
                setIsFetching(false)
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
            }
        } else {
            const res = await categoryApi.updateCateogry(props.data.id, values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                props.onClose()
                setIsFetching(false)
                await getAllCategories(dispatch)
            } else {
                setIsFetching(false)
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
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
                    slug: props.data.slug
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
                    label="Category Name:"
                    name="label"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your value!',
                        },
                    ]}
                >
                    <Input placeholder="Category name..." />
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
                    <Input placeholder="Slug..." />
                </Form.Item>

            </Form>
        </Drawer>
    )
}

export default CategoryDrawer