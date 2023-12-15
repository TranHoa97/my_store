import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Space, Button, Form, Input, Upload, Drawer } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import imageApi from '../../services/ImageApi'
import { getImagesByFilter } from '../../redux/image/imageRequest'
import { openNotification } from '../../redux/slice/notificationSlice'

const ImageDrawer = (props) => {

    const dispatch = useDispatch()
    const [form] = Form.useForm()

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
        setIsFetching(true)
        const formData = new FormData()

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
                await getImagesByFilter(dispatch)
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
                await getImagesByFilter(dispatch)
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
            setFileList([])
        } else {
            if(props.data) {
                form.setFieldsValue({
                    product_id: props.data.product_id
                })
                setFileList([{
                    uuid: props.data.id,
                    name: props.data.title,
                    url: props.data.url,
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