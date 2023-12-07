import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { Space, Row, Col, Button, Form, Input, Upload, Select, Typography } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import productApi from '../../services/ProductApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { getProductsByFilter } from '../../redux/product/productRequest'

const UpdateProduct = (props) => {

    const dispatch = useDispatch()
    let [searchParams, setSearchParams] = useSearchParams();
    const [form] = Form.useForm()

    const product = props.data
    const brands = props.brands.filter(item => item.category_id === product.category_id)
    const attributes = props.attributes.filter(item => item.category_id === product.category_id)

    const [fileList, setFileList] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const singleFileUpload = {
        listType: "picture",
        maxCount: 1,
        onChange: (info) => {
            let newFileList = [...info.fileList];

            newFileList = newFileList.map((file) => {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
            });
            setFileList(newFileList);
        },
        beforeUpload: () => {
            return false;
        },
        fileList: fileList
    }

    const checkSearchParams = (categoryId) => {
        const params = searchParams.get("categoryId")
        if(categoryId === Number(params)) {
            getProductsByFilter(dispatch, location.search)
        } else {
            setSearchParams({ categoryId: categoryId })
        }
    }

    const handlePostData = async (values) => {
        // console.log(values);
        const formData = new FormData()
        const newValues = Object.keys(values).filter(item => item !== "images" && item !== "thumbnail")
        newValues.forEach(item => {
            formData.append(item, values[item])
        })
        if (values.thumbnail) {
            formData.append("thumbname", product.thumbname)
            formData.append("thumbnail", values.thumbnail.file)
        }

        setIsFetching(true)
        const res = await productApi.updateProduct(props.data.id, formData)
        if (res.st === 1) {
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            setIsFetching(false)
            checkSearchParams(values.category_id)
            props.onClose()
        } else {
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
            setIsFetching(false)
        }
    }

    useEffect(() => {
        let formValue = {}
        product.attributes.forEach(item => {
            formValue = {
                ...formValue,
                [item.attributes_name]: [item.id]
            }
        })
        form.setFieldsValue({
            ...formValue,
            title: product.title,
            slug: product.slug,
            category_id: product.category_id,
            brand_id: product.brand_id
        })
        setFileList([{
            uuid: product.id,
            name: product.thumbname,
            url: product.thumbnail,
            status: "done"
        }])
    }, [])

    return (
        <>
            <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
                <Row justify={"space-between"} align={"middle"}>
                    <Typography.Title level={3}>Update Product</Typography.Title>
                    <Button type='primary' onClick={props.onClose}>
                        Back
                    </Button>
                </Row>
                <Form 
                    form={form} 
                    id="myForm" 
                    onFinish={handlePostData}
                    layout="vertical"
                >
                    {/* PRODUCT NAME */}
                    <Form.Item
                        label="Product Name:"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!',
                            },
                        ]}
                    >
                        <Input placeholder="Product Name..." />
                    </Form.Item>

                    {/* SLUG */}
                    <Form.Item
                        label="SKU:"
                        name="slug"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input placeholder="Slug..." />
                    </Form.Item>

                    {/* THUMBNAIL */}
                    <Form.Item label="Thumbnail:" name={"thumbnail"}>
                        <Upload
                            {...singleFileUpload}
                        >
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>

                    {/* CATEGORY */}
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
                            placeholder="Please Select..."
                            style={{ textTransform: "capitalize" }}
                            options={[{ value: product.category_id, label: product.category_name }]}
                        />
                    </Form.Item>

                    {/* BRAND */}
                    {brands ? (
                        <Form.Item
                            label="Brand:"
                            name="brand_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your brand!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Please Select..."
                                options={brands}
                                style={{ textTransform: "capitalize" }}
                            />
                        </Form.Item>
                    ) : (<></>)}

                    {/* ATTRIBUTES */}
                    {attributes && attributes.map((item, index) => (
                        <Form.Item
                            key={index}
                            label={`${item.title}:`}
                            name={item.title}
                            style={{ textTransform: "capitalize" }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your value!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Please Select..."
                                mode='multiple'
                                allowClear
                                options={item.data.map(item => {
                                    return { label: item.title, value: item.id }
                                })}
                                style={{ textTransform: "capitalize" }}
                            />
                        </Form.Item>
                    ))}

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
            </Space>
        </>
    )
}

export default UpdateProduct