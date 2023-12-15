import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Spin, Row, Col, Button, Form, Input, Select, Card, InputNumber, Typography, Space } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import { getAllVariants } from '../../redux/variants/variantsRequest'
import { setMenu } from '../../redux/slice/menuSiderSlice'
import orderApi from '../../services/OrderApi'
import { openNotification } from '../../redux/slice/notificationSlice'

const AddOrder = () => {

    const [form] = Form.useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const data = useSelector(state => state.variants)
    const variants = data.value ? data.value.map((item, index) => {
        return {
            value: index,
            label: `${item.title} - ${item.price}VND - ${item.color}`,
            price: item.price,
            variants_id: item.id,
            color: item.color
        }
    }) : []

    const [amount, setAmount] = useState(0)
    const [isFetching, setIsFetching] = useState(false)

    const handlePostData = async (values) => {
        // console.log(values);
        setIsFetching(true)
        const res = await orderApi.createOrder(values)
        if (res.st === 1) {
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            navigate(`/orders`)
            setIsFetching(false)
        } else {
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
            setIsFetching(false)
        }
    }

    const changeVariants = (e, key) => {
        // console.log(e, key);
        const item = variants.find(item => item.value === e)
        const data = form.getFieldValue('products');
        data[key] = {
            ...data[key],
            quantity: 1,
            rate: item.price,
            amount: item.price,
            variants_id: item.variants_id,
            color: item.color
        };
        form.setFieldValue('products', data);
        setAmount(data.reduce((total, item) => total + Number(item.amount), 0))
    }

    const changeQuantity = (e, key) => {
        // console.log(e);
        const data = form.getFieldValue('products');
        const item = variants.find(item => item.variants_id === data[key].variants_id)
        if (e) {
            data[key] = { ...data[key], quantity: e, rate: item.price, amount: e * item.price || "" };
            form.setFieldValue('products', data);
        } else {
            data[key] = { ...data[key], quantity: e, rate: "", amount: "" };
            form.setFieldValue('products', data);
        }
        setAmount(data.reduce((total, item) => total + Number(item.amount), 0))
    }

    useEffect(() => {
        dispatch(setMenu(["11", "sub4"]))
        getAllVariants(dispatch)
    }, [])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"} align={"middle"}>
                <Typography.Title level={3}>Add Order</Typography.Title>
                <Button type='primary' onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Row>

            {
                data.isFetching ? (
                    <Row justify={"center"} align={"middle"} style={{ height: "100%" }}>
                        <Spin size='large' />
                    </Row>
                ) : (
                    <Form form={form} id="myForm" onFinish={handlePostData} layout="vertical">
                        <Row justify={"space-between"} gutter={[15, 0]}>
                            {/* CUSTOMER NAME */}
                            <Col span={8}>
                                <Form.Item label="Customer Name:" name="username"
                                    rules={[{ required: true, message: 'Please input your name!' }]}
                                >
                                    <Input placeholder="Username..." />
                                </Form.Item>
                            </Col>

                            {/* CUSTOMER ADDRESS */}
                            <Col span={8}>
                                <Form.Item label="Customer Address:" name="address"
                                    rules={[{ required: true, message: 'Please input your address!' }]}
                                >
                                    <Input placeholder="Address..." />
                                </Form.Item>
                            </Col>

                            {/* CUSTOMER PHONE */}
                            <Col span={8}>
                                <Form.Item label="Customer Phone:" name="phone"
                                    rules={[{ required: true, message: 'Please input your address!' }]}
                                >
                                    <Input placeholder="Phone..." />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* STATUS */}
                        <Form.Item label="Status:" name="status"
                            rules={[{ required: true, message: 'Please input your address!' }]}
                        >
                            <Select
                                placeholder="Please Select..."
                                options={[
                                    { value: "Đang xử lý", label: "Đang xử lý" },
                                    { value: "Đang vận chuyển", label: "Đang vận chuyển" },
                                    { value: "Đã xong", label: "Đã xong" },
                                ]}
                                style={{ textTransform: "capitalize" }}
                            />
                        </Form.Item>

                        {/* PRODUCTS */}
                        <Row style={{ marginBottom: "10px" }}>Orders:</Row>
                        <Form.List name="products">
                            {(fields, { add, remove }) => (
                                <div
                                    style={{
                                        display: 'flex',
                                        rowGap: 16,
                                        flexDirection: 'column',
                                    }}
                                >
                                    {fields.map((field, index) => (
                                        <Card
                                            size="small"
                                            title={`Item ${field.name + 1}`}
                                            key={field.key}
                                            extra={
                                                <CloseOutlined
                                                    onClick={() => {
                                                        remove(field.name);
                                                        const data = form.getFieldValue('products');
                                                        setAmount(data.reduce((total, item) => total + Number(item.amount), 0))
                                                    }}
                                                />
                                            }
                                        >
                                            <Row gutter={[15, 0]} justify={"end"}>
                                                <Col span={18}>
                                                    <Form.Item label="Products" name={[field.name, 'index']}>
                                                        <Select
                                                            placeholder="Please Select..."
                                                            options={variants}
                                                            style={{ textTransform: "capitalize" }}
                                                            onChange={(e) => changeVariants(e, index)}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item label="Qty" name={[field.name, 'quantity']}
                                                        rules={[
                                                            { required: true, message: "Please input your number!" },
                                                            { type: 'number', message: "Please input your number!" }
                                                        ]}
                                                    >
                                                        <InputNumber
                                                            style={{ width: "100%" }}
                                                            onChange={(e) => changeQuantity(e, index)}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item label="Rate" name={[field.name, 'rate']}>
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item label="Amount" name={[field.name, 'amount']}>
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}

                                    <Button type="dashed" onClick={() => add()} block>
                                        + Add Item
                                    </Button>
                                </div>
                            )}
                        </Form.List>

                        <Row justify={"end"} style={{ marginTop: "30px", fontWeight: "bold" }} gutter={[5, 0]}>
                            <Col>Net Amount:</Col>
                            <Col>{amount}</Col>
                        </Row>

                        <Row justify={"end"} style={{ marginTop: "30px" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isFetching}
                            >
                                Save Changes
                            </Button>
                        </Row>

                    </Form>
                )
            }
        </Space>
    )
}

export default AddOrder