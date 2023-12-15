import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { Space, Row, Button, Form, Input, Drawer, InputNumber } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import variantsApi from '../../services/VariantsApi';
import { openNotification } from '../../redux/slice/notificationSlice';
import { getAllVariants, getVariantsByProduct } from '../../redux/variants/variantsRequest';

const { TextArea } = Input;

const VariantsDrawer = (props) => {

    const dispatch = useDispatch()
    const params = useParams()
    const [form] = Form.useForm()

    const [isFetching, setIsFetching] = useState(false)

    const handlePostData = async (values) => {
        console.log(values);
        setIsFetching(true)
        if (props.action === "create") {
            const res = await variantsApi.createVariants({ ...values, product_id: params.slug })
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
                props.onClose()
                await getVariantsByProduct(dispatch, params.slug)
            } else {
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
            }
        } else {
            const res = await variantsApi.updateVariants(props.data.id, values)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
                props.onClose()
                await getVariantsByProduct(dispatch, params.slug)
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
                const { title, slug, price, quantity, sold, description, ram, storage, colors } = props.data
                form.setFieldsValue({
                    title: title,
                    slug: slug,
                    price: Number(price),
                    quantity: Number(quantity),
                    sold: Number(sold),
                    description: description,
                    cpu: props.data.cpu,
                    display: props.data.display,
                    graphics: props.data.graphics,
                    wieght: props.data.weight,
                    ram: ram,
                    storage: storage,
                    colors: colors.map(item => item.title)
                })
            }
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
                    {/* PRODUCT NAME */}
                    <Form.Item
                        label="Variants Name:"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your value!',
                            },
                        ]}
                    >
                        <Input placeholder="Variants name..." />
                    </Form.Item>

                    {/* SLUG */}
                    <Form.Item label="SKU:" name={"slug"}
                        rules={[
                            { required: true, message: "Please select your value!" },
                        ]}
                    >
                        <Input placeholder="Slug..." allowClear />
                    </Form.Item>

                    {/* PRICE */}
                    <Form.Item label="Price:" name={"price"}
                        rules={[
                            { required: true, message: "Please input your number!" },
                            { type: 'number', message: "Please input your number!" }
                        ]}
                    >
                        <InputNumber addonAfter="VND" placeholder="..." style={{ width: "100%" }} />
                    </Form.Item>

                    {/* QUANTITY */}
                    <Form.Item label="Quantity:" name={"quantity"}
                        rules={[
                            { required: true, message: "Please input your number!" },
                            { type: 'number', message: "Please input your number!" }
                        ]}
                    >
                        <InputNumber addonAfter="chiếc" placeholder="..." style={{ width: "100%" }} />
                    </Form.Item>

                    {/* PRODUCT SOLD */}
                    <Form.Item label="Sold:" name={"sold"}
                        rules={[
                            { required: true, message: "Please input your number!" },
                            { type: 'number', message: "Please input your number!" }
                        ]}
                    >
                        <InputNumber addonAfter="chiếc" placeholder="..." style={{ width: "100%" }} />
                    </Form.Item>

                    {/* DESCRIPTION */}
                    <Form.Item label="Description:" name={"description"}
                        rules={[
                            { required: true, message: "Please select your value!" },
                        ]}
                    >
                        <TextArea rows={8} />
                    </Form.Item>

                    {/* CPU */}
                    <Form.Item
                        label="Cpu:"
                        name="cpu"
                    >
                        <Input placeholder="ram..." />
                    </Form.Item>

                    {/* DISPLAY */}
                    <Form.Item
                        label="Display:"
                        name="display"
                    >
                        <Input placeholder="ram..." />
                    </Form.Item>

                    {/* GRAPHICS */}
                    <Form.Item
                        label="Graphics:"
                        name="graphics"
                    >
                        <Input placeholder="ram..." />
                    </Form.Item>

                    {/* WEIGHT */}
                    <Form.Item
                        label="Weight:"
                        name="weight"
                    >
                        <Input placeholder="ram..." />
                    </Form.Item>

                    {/* RAM */}
                    <Form.Item
                        label="Ram:"
                        name="ram"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your value!',
                            },
                        ]}
                    >
                        <Input placeholder="ram..." />
                    </Form.Item>

                    {/* STORAGE */}
                    <Form.Item
                        label="Storage:"
                        name="storage"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your value!',
                            },
                        ]}
                    >
                        <Input placeholder="storage..." />
                    </Form.Item>

                    {/* COLORS */}
                    <Form.List
                        name="colors"
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                <Row style={{ paddingBottom: "8px" }}>Colors:</Row>
                                {fields.map((field) => (
                                    <Form.Item
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            noStyle
                                        >
                                            <Input
                                                placeholder="passenger name"
                                                style={{
                                                    width: '60%',
                                                }}
                                            />
                                        </Form.Item>
                                        {fields.length > 0 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{
                                            width: '60%',
                                        }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add field
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </Form>
            </Drawer>
        </>
    )
}

export default VariantsDrawer