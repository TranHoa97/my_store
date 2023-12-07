import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Space, Row, Button, Form, Input, Upload, Select, Typography } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { getAllCategories } from '../../redux/category/categoryRequest'
import productApi from '../../services/ProductApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { getBrandsByFilter } from '../../redux/brand/brandRequest'
import { getAttributesByFilter } from '../../redux/attributes/attributesRequest'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const AddProduct = () => {

    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const categories = useSelector(state => state.category.value)?.map(item => {
        return { value: item.id, label: item.label }
    })
    const brands = useSelector(state => state.brand.value)?.map((item) => {
        return { value: item.id, label: item.label, category_id: item.category_id }
    })
    const attributes = useSelector(state => state.attributes.attributes.value)

    const [fileList, setFileList] = useState([])
    const [multiFileList, setMultiFileList] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [productBrand, setProductBrand] = useState(null)
    const [productAttributes, setProductAttributes] = useState(null)

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

    const multiFileUpload = {
        listType: "picture",
        maxCount: 6,
        multiple: true,
        onChange: (info) => {
            let newMultiFileList = [...info.fileList];

            newMultiFileList = newMultiFileList.map((file) => {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
            });
            setMultiFileList(newMultiFileList);
        },
        beforeUpload: () => {
            return false;
        },
        fileList: multiFileList
    }

    const handlePostData = async (values) => {
        // console.log(values);
        const formData = new FormData()
        const newValues = Object.keys(values).filter(item => item !== "images" && item !== "thumbnail")
        newValues.forEach(item => {
            formData.append(item, values[item])
        })
        formData.append("thumbnail", values.thumbnail.file)
        values.images.fileList.forEach(item => {
            formData.append("images", item.originFileObj)
        })

        setIsFetching(true)
        const res = await productApi.createProduct(formData)
        if (res.st === 1) {
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            navigate(`/products?categoryId=${values.category_id}`)
            setIsFetching(false)
        } else {
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
            setIsFetching(false)
        }
    }

    const handleChange = async (e) => {
        setProductBrand(brands.filter(item => item.category_id === e))
        setProductAttributes(attributes.filter(item => item.category_id === e))
    }

    useEffect(() => {
        dispatch(setMenu(["9", "sub3"]))
        getAllCategories(dispatch)
        getAttributesByFilter(dispatch)
        getBrandsByFilter(dispatch)
    }, [])

    return (
        <>
            <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
                <Row justify={"space-between"} align={"middle"}>
                    <Typography.Title level={3}>Add Product</Typography.Title>
                    <Button type='primary' onClick={() => navigate(-1)}>
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
                    <Form.Item label="Thumbnail:" name={"thumbnail"}
                        rules={[
                            { required: true, message: "Please upload your file!" },
                        ]}
                    >
                        <Upload
                            {...singleFileUpload}
                        >
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>

                    {/* IMAGES */}
                    <Form.Item label="Images:" name={"images"}
                        rules={[
                            { required: true, message: "Please upload your file!" },
                        ]}
                    >
                        <Upload
                            {...multiFileUpload}
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
                                message: 'Please input your name!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Please Select..."
                            options={categories}
                            style={{ textTransform: "capitalize" }}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    {/* BRAND */}
                    {productBrand ? (
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
                                options={productBrand}
                                style={{ textTransform: "capitalize" }}
                            />
                        </Form.Item>
                    ) : (<></>)}

                    {/* ATTRIBUTES */}
                    {productAttributes && productAttributes.map((item, index) => (
                        <Form.Item
                            key={index}
                            label={`${item.title}:`}
                            name={item.title}
                            style={{ textTransform: "capitalize" }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
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

export default AddProduct