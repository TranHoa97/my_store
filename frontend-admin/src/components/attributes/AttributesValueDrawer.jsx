import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Space, Button, Form, Input, Drawer } from 'antd'

import { openNotification } from '../../redux/slice/notificationSlice'
import attributesApi from '../../services/AttributesApi'
import { getAttributesValue } from '../../redux/attributes/attributesRequest'

const AttributesValueDrawer = (props) => {

    const params = useParams()
    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const [isFetching, setIsFetching] = useState(false)

    const handlePostData = async (values) => {
        // console.log(values);
        try {
            setIsFetching(true)
            if (props.action === "create") {
                const res = await attributesApi.createAttributesValue({ ...values, attributes_id: params.slug })
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    props.onClose()
                    setIsFetching(false)
                    await getAttributesValue(dispatch, params.slug)
                } else {
                    setIsFetching(false)
                    dispatch(openNotification(
                        { type: "error", message: res.msg, duration: 2, open: true }
                    ))
                }
            } else {
                const res = await attributesApi.updateAttributesValue(props.data.id, values)
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    props.onClose()
                    setIsFetching(false)
                    await getAttributesValue(dispatch, params.slug)
                } else {
                    setIsFetching(false)
                    dispatch(openNotification(
                        { type: "error", message: res.msg, duration: 2, open: true }
                    ))
                }
            }
        } catch(err) {
            setIsFetching(false)
            dispatch(openNotification(
                { type: "error", message: "Something wrong!", duration: 2, open: true }
            ))
        }
    }

    useEffect(() => {
        if (props.action === "create") {
            form.resetFields()
        } else {
            if (props.data) {
                const { label, slug } = props.data
                form.setFieldsValue({
                    title: label,
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
                    label="Attributes Value:"
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

            </Form>
        </Drawer>
    )
}

export default AttributesValueDrawer