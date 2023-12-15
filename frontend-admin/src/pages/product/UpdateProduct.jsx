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

    // const product = props.data
    const brands = props.brands.filter(item => item.category_id === props.data.category_id)
    const attributes = props.attributes.filter(item => item.category_id === props.data.category_id)

    const [fileList, setFileList] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [product, setProduct] = useState(null)

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
        if (categoryId === Number(params)) {
            getProductsByFilter(dispatch, location.search)
        } else {
            setSearchParams({ categoryId: categoryId })
        }
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

    const fetchProduct = async () => {
        const res = await productApi.getProductsByFilter(`?productId=${props.data.id}`)
        if (res.st === 1) {
            setProduct(res.data)
        } else {
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [])

    useEffect(() => {
        if (product) {
            let formValue = {}
            attributes.forEach(item => {
                const setValue = product.attributes.filter(e => {
                    if (item.id === e.attribute_id) {
                        return e.id
                    }
                })
                formValue = {
                    ...formValue,
                    [item.label]: setValue.map(item => item.id)
                }
            })
            form.setFieldsValue({
                title: product.title,
                slug: product.slug,
                category_id: product.category_id,
                brand_id: product.brand_id,
                attributes: formValue
            })
            setFileList([{
                uuid: product.id,
                name: product.thumbname,
                url: product.thumbnail,
                status: "done"
            }])
        }
    }, [product])

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
                            options={[{ value: props.data.category_id, label: props.data.category_name }]}
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
                    <Form.List name={"attributes"}>
                        {() => (
                            <div>
                                {attributes.map((item, index) => (
                                    <div key={index}>
                                        <Form.Item
                                            label={item.label}
                                            name={item.label}
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
                                                    return { label: item.label, value: item.id }
                                                })}
                                                style={{ textTransform: "capitalize" }}
                                            />
                                        </Form.Item>
                                    </div>
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

export default UpdateProduct