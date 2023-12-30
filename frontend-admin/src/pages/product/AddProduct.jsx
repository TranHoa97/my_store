import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Space, Row, Button, Form, Input, Upload, Select, Typography, Col } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { getCategoryByFilter } from '../../redux/category/categoryRequest'
import productApi from '../../services/ProductApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { getBrandsByFilter } from '../../redux/brand/brandRequest'
import { getAttributesByFilter } from '../../redux/attributes/attributesRequest'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const AddProduct = () => {

    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const categories = useSelector(state => state.category.value?.data)?.map(item => {
        return { value: item.id, label: item.label }
    })
    const brands = useSelector(state => state.brand.value?.data)?.map((item) => {
        return { value: item.id, label: item.label, category_id: item.category_id }
    })
    const attributes = useSelector(state => state.attributes.attributes.value?.data)
    const pagination = useSelector(state => state.product.value?.pagination)

    const [fileList, setFileList] = useState([])
    const [multiFileList, setMultiFileList] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [productBrand, setProductBrand] = useState(null)
    const [productAttributes, setProductAttributes] = useState([])

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
        for(let key in values) {
            if(key !== "images" && key !== "thumbnail" && key !== "attributes") {
                formData.append(key, values[key])
            }
        }
        let newAttributes = []
        for(let key in values.attributes) {
            newAttributes = newAttributes.concat(values.attributes[key])
        }
        formData.append("attributes", newAttributes)
        formData.append("thumbnail", values.thumbnail.file)
        values.images.fileList.forEach(item => {
            formData.append("images", item.originFileObj)
        })

        try {
            setIsFetching(true)
            const res = await productApi.createProduct(formData)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
                navigate(`/products?page=1&limit=4&category=${values.category_id}`)
            } else {
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
                setIsFetching(false)
            }
        } catch (err) {
            dispatch(openNotification(
                { type: "error", message: "Something wrong!", duration: 2, open: true }
            ))
            setIsFetching(false)
        }
    }

    const handleChange = (e) => {
        setProductBrand(brands.filter(item => item.category_id === e))
        setProductAttributes(attributes.filter(item => item.category_id === e))
    }

    useEffect(() => {
        dispatch(setMenu(["9", "sub3"]))
        getCategoryByFilter(dispatch)
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
                                message: 'Please input your value!',
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
                                    message: 'Please input your value!',
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
                    <Form.List name={"attributes"}>
                        {() => (
                            <div>
                                {productAttributes.map((item, index) => (
                                    <Form.Item
                                        key={index}
                                        label={item.label}
                                        name={item.label}
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        <Select
                                            placeholder="Please Select..."
                                            mode='multiple'
                                            allowClear
                                            options={item.data?.map(item => {
                                                return { label: item.label, value: item.id ? item.id : "" }
                                            })}
                                            style={{ textTransform: "capitalize" }}
                                        />
                                    </Form.Item>
                                ))}
                            </div>
                        )}
                    </Form.List>

                    {/* SUBMIT */}
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