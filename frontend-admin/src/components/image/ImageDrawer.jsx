import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Space, Button, Form, Input, Upload, Drawer } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import imageApi from '../../services/ImageApi'
import { getImagesByFilter } from '../../redux/image/imageRequest'
import { openNotification } from '../../redux/slice/notificationSlice'

const ImageDrawer = (props) => {

    const dispatch = useDispatch()
    const location = useLocation()
    const [form] = Form.useForm()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = searchParams.get("page")
    const limit = searchParams.get("limit")

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

    const handlePostData = async (values) => {
        // console.log(values);
        try {
            const formData = new FormData()
            setIsFetching(true)
            if (props.action === "create") {
                formData.append("image", values.image.file)
                formData.append("product_id", values.product_id)
                const res = await imageApi.createImage(formData)
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    props.onClose()
                    setIsFetching(false)
                    if(+page === 1) {
                        await getImagesByFilter(dispatch, `?page=1&limit=${limit}`)
                    } else {
                        setSearchParams({ page: 1, limit: 4 })
                    }
                } else {
                    setIsFetching(false)
                    dispatch(openNotification(
                        { type: "error", message: res.msg, duration: 2, open: true }
                    ))
                }
            } else {
                formData.append("image", values.image.file)
                const res = await imageApi.updateImage(props.data.id, props.data.title, formData)
                if (res.st === 1) {
                    dispatch(openNotification(
                        { type: "success", message: res.msg, duration: 2, open: true }
                    ))
                    props.onClose()
                    setIsFetching(false)
                    await getImagesByFilter(dispatch, location.search ? location.search : `?page=1&limit=${props.limit}`)
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
            setFileList([])
        } else {
            if(props.data) {
                const { product_id, id, title, url } = props.data
                form.setFieldsValue({
                    product_id: product_id
                })
                setFileList([{
                    uuid: id,
                    name: title,
                    url: url,
                    status: "done"
                }])
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
                    {/* Product Id */}
                    <Form.Item
                        label="Product Id:"
                        name="product_id"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your value!',
                            },
                        ]}
                    >
                        <Input 
                            placeholder="Product Id..."
                            disabled={props.action === "update" ? true : false} 
                        />
                    </Form.Item>

                    {/* Image */}
                    <Form.Item label="Image:" name={"image"}
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

                </Form>
            </Drawer>
        </>
    )
}

export default ImageDrawer