import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Space, Button, Table, Row, Modal, Typography,Col } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'

import VariantsDrawer from '../../components/variants/VariantsDrawer'
import { getVariantsByProduct } from '../../redux/variants/variantsRequest'
import variantsApi from '../../services/VariantsApi'
import { openNotification } from '../../redux/slice/notificationSlice'

const ManageVariants = () => {

    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isFetching = useSelector(state => state.variants.isFetching)
    const variants = useSelector(state => state.variants.value)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [updateData, setUpdateData] = useState(null)
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Variants Name',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Sold',
            dataIndex: 'sold',
            key: 'sold',
        },
        {
            title: 'Ram',
            dataIndex: 'ram',
            key: 'ram',
        },
        {
            title: 'Storage',
            dataIndex: 'storage',
            key: 'storage',
        },
        {
            title: 'Color',
            dataIndex: 'colors',
            key: 'colors',
            render: (colors) => <div style={{ textTransform: "capitalize", whiteSpace: "nowrap" }}>
                {colors?.map((item, index) => (
                    <div key={index}>{item.label}</div>
                ))}
            </div>
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
        const checkPermission = account.find(item => item.url === "/variants/create" || item.url === "/variants/update")
        if(checkPermission) {
            setIsDrawerOpen(true)
            setAction(action)
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const showModal = (record) => {
        setIsModalOpen(true)
        setUpdateData(record)
    }

    const handleDelete = async () => {
        setLoading(true)
        const res = await variantsApi.deleteVariants(updateData.id)
        if (res.st === 1) {
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            setIsModalOpen(false)
            setLoading(false)
            await getVariantsByProduct(dispatch, params.slug)
        } else {
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
            setIsModalOpen(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkPermission = account.find(item => item.url === "/variants/read")
        if(checkPermission) {
            getVariantsByProduct(dispatch, params.slug)
        } else {
            navigate(`/error/403`)
        }
    }, [])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Variants</Typography.Title>
                <Space size={"middle"}>
                    <Button onClick={() => navigate(-1)}>Back</Button>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => getVariantsByProduct(dispatch, params.slug)}
                    >
                        Refresh
                    </Button>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => showDrawer("create")}
                    >
                        Add new
                    </Button>
                </Space>
            </Row>

            <Table
                columns={columns}
                dataSource={variants}
                pagination={{ pageSize: 8 }}
                loading={isFetching}
            />

            <VariantsDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                action={action}
                data={updateData}
            />

            <Modal
                title={"Delete Variants"}
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={loading}
                style={{ top: 20 }}
            >
                <p>Do you want to delete brand ?</p>
            </Modal>
        </Space>
    )
}

export default ManageVariants