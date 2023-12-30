import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Space, Button, Form, Input, Drawer, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import categoryApi from '../../services/CategoryApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { getCategoryByFilter } from '../../redux/category/categoryRequest'

const CategoryDrawer = (props) => {

    const dispatch = useDispatch()
    const location = useLocation()
    const [form] = Form.useForm()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = searchParams.get("page")

    const [isFetching, setIsFetching] = useState(false)
    const [iconList, setIconList] = useState([])
    const [imageList, setImageList] = useState([])

    const iconUpload = {
        listType: "picture",
        maxCount: 1,
        onChange: (info) => {
            let newIconList = [...info.fileList];

            newIconList = newIconList.map((file) => {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
            });
            setIconList(newIconList);
        },
        beforeUpload: () => {
            return false;
        },
        fileList: iconList
    }

    const imageUpload = {
        listType: "picture",
        maxCount: 1,
        onChange: (info) => {
            let newImageList = [...info.fileList];

            newImageList = newImageList.map((file) => {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
            });
            setImageList(newImageList);
        },
        beforeUpload: () => {
            return false;
        },
        fileList: imageList
    }

    const handlePostData = async (values) => {
        // console.log(values);
        const formData = new FormData()
        formData.append("label", values.label)
        formData.append("slug", values.slug)

        try {
            setIsFetching(true)
            if (props.action === "create") {
                formData.append("image", values.image.file)
                formData.append("icon", values.icon.file)
                const res = await categoryApi.createCateogry(formData)
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    setIsFetching(false)
                    props.onClose()
                    if (+page === 1) {
                        await getCategoryByFilter(dispatch, `?page=1&limit=${props.limit}`)
                    } else {
                        setSearchParams({ page: 1, limit: props.limit })
                    }
                } else {
                    setIsFetching(false)
                    dispatch(openNotification(
                        { type: "error", message: res.msg, duration: 2, open: true }
                    ))
                }
            } else {
                if (values.icon) {
                    formData.append("icon", values.icon.file)
                    formData.append("icon_name", props.data.icon_name)
                }
                if (values.image) {
                    formData.append("image", values.image.file)
                    formData.append("image_name", props.data.image_name)
                }
                const res = await categoryApi.updateCateogry(props.data.id, formData)
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    props.onClose()
                    setIsFetching(false)
                    await getCategoryByFilter(dispatch, location.search ? location.search : `?page=1&limit=${props.limit}`)
                } else {
                    setIsFetching(false)
                    dispatch(openNotification(
                        { type: "error", message: res.msg, duration: 2, open: true }
                    ))
                }
            }
        } catch (err) {
            setIsFetching(false)
            dispatch(openNotification(
                { type: "error", message: "Something wrong!", duration: 2, open: true }
            ))
        }
    }

    useEffect(() => {
        if (props.action === "create") {
            form.resetFields()
            setIconList([])
            setImageList([])
        } else {
            if (props.data) {
                form.setFieldsValue({
                    label: props.data.label,
                    slug: props.data.slug
                })
                setIconList([{
                    uuid: props.data.id,
                    name: props.data.icon_name,
                    url: props.data.icon_url,
                    status: "done"
                }])
                setImageList([{
                    uuid: props.data.id,
                    name: props.data.image_name,
                    url: props.data.image_url,
                    status: "done"
                }])
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
                {/* LABEL */}
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

                {/* SLUG */}
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

                {/* ICON */}
                <Form.Item label="Icon:" name={"icon"}
                    rules={[
                        {
                            required: props.action === "update" ? false : true,
                            message: "Please upload your file!"
                        },
                    ]}
                >
                    <Upload
                        {...iconUpload}
                    >
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item>

                {/* IMAGE */}
                <Form.Item label="Image:" name={"image"}
                    rules={[
                        {
                            required: props.action === "update" ? false : true,
                            message: "Please upload your file!"
                        },
                    ]}
                >
                    <Upload
                        {...imageUpload}
                    >
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item>

            </Form>
        </Drawer>
    )
}

export default CategoryDrawer