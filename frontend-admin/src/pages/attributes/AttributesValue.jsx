import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Space, Col, Button, Table, Row, Input, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'

import { getAttributesValue } from '../../redux/attributes/attributesRequest'
import AttributesValueDrawer from '../../components/attributes/AttributesValueDrawer'
import attributesApi from '../../services/AttributesApi'
import { openNotification } from '../../redux/slice/notificationSlice'

const AttributesValue = () => {

    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isFetching = useSelector(state => state.attributes.value.isFetching)
    const data = useSelector(state => state.attributes.value?.value)
    const attributesValue = useSelector(state => state.attributes.value.value?.data)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [updateData, setUpdateData] = useState(null)
    const [loading, setLoading] = useState(null)

    const columns = [
        {
            title: 'ValueId',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Attributes Value',
            dataIndex: 'label',
            key: 'label',
            render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showDrawer("update", record)}>Update</a>
                    <a onClick={() => showModal(record)}>Delete</a>
                </Space>
            ),
        },
    ]

    const showDrawer = (action, record) => {
        const checkPermissionCreate = account.find(item => item.url === "/attributes/create-value")
        const checkPermissionUpdate = account.find(item => item.url === "/attributes/update-value")
        if (checkPermissionCreate) {
            setIsDrawerOpen(true)
            setAction(action)
        } else {
            navigate(`/error/403`)
        }
        if (checkPermissionUpdate) {
            setIsDrawerOpen(true)
            setAction(action)
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const showModal = (record) => {
        const checkPermissionDelete = account.find(item => item.url === "/attributes/delete-value")
        if (checkPermissionDelete) {
            setIsModalOpen(true);
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await attributesApi.deleteAttributesValue(updateData.id)
            if (res.st === 1) {
                setLoading(false)
                setIsModalOpen(false)
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                await getAttributesValue(dispatch, params.slug)
            } else {
                setLoading(false)
                setIsModalOpen(false)
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
            }
        } catch(err) {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "error", message: "Something wrong!", duration: 2, open: true }
            ))
        }
    }

    useEffect(() => {
        const checkPermission = account.find(item => item.url === "/attributes/read-value")
        if(checkPermission) {
            getAttributesValue(dispatch, params.slug)
        } else {
            navigate(`/error/403`)
        }
    }, [])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Attributes Value</Typography.Title>
                <Space size={"middle"}>
                    <Button onClick={() => navigate(-1)}>Back</Button>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => getAttributesValue(dispatch, params.slug)}
                    >
                        Refresh
                    </Button>
                    <Button
                        type='primary'
                        size='middle'
                        icon={<PlusOutlined />}
                        onClick={() => showDrawer("create")}
                    >
                        Add Value
                    </Button>
                </Space>
            </Row>
            <Row justify={"space-between"}>
                <Col>
                    <Space direction={"vertical"} size={"middle"} style={{ textTransform: "capitalize" }}>
                        <Space size={"middle"}>
                            Attributes name:
                            <Typography.Text strong>{data?.attribute}</Typography.Text>
                        </Space>
                        <Space size={"middle"}>
                            Category: <Typography.Text strong>{data?.category}</Typography.Text>
                        </Space>
                    </Space>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={attributesValue}
                loading={isFetching}
                pagination={{ pageSize: 6 }}
            />

            <AttributesValueDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                action={action}
                data={updateData}
            />

            <Modal
                title={"Delete Attributes Value"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleDelete}
                confirmLoading={loading}
                style={{ top: 20 }}
            >
                <p>Do you want to delete attributes value ?</p>
            </Modal>
        </Space>
    )
}

export default AttributesValue