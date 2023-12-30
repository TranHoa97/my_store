import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Space, Button, Table, Row, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'

import VariantsDrawer from '../../components/variants/VariantsDrawer'
import { getVariantByFilter } from '../../redux/variants/variantsRequest'
import variantsApi from '../../services/VariantsApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import numberWithCommas from '../../ultis/numberWithCommas'

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
            title: 'VariantId',
            dataIndex: 'id',
            key: 'id',
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
            render: (number) => <div>{numberWithCommas(+number)}</div>
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
        const checkPermissionCreate = account.find(item => item.url === "/variants/create")
        const checkPermissionUpdate = account.find(item => item.url === "/variants/update")
        if(checkPermissionCreate) {
            setIsDrawerOpen(true)
            setAction(action)
        } else {
            navigate(`/error/403`)
        }
        if(checkPermissionUpdate) {
            setIsDrawerOpen(true)
            setAction(action)
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const showModal = (record) => {
        const checkPermissionDelete = account.find(item => item.url === "/variants/delete")
        if(checkPermissionDelete) {
            setIsModalOpen(true);
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await variantsApi.deleteVariants(updateData.id)
            if (res.st === 1) {
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                setIsModalOpen(false)
                setLoading(false)
                await getVariantByFilter(dispatch, `?productId=${params.slug}`)
            } else {
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 3, open: true }
                ))
                setIsModalOpen(false)
                setLoading(false)
            }
        } catch(err) {
            dispatch(openNotification(
                { type: "error", message: "Something wrong!", duration: 3, open: true }
            ))
            setIsModalOpen(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkPermission = account.find(item => item.url === "/variants/read")
        if(checkPermission) {
            getVariantByFilter(dispatch, `?productId=${params.slug}`)
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
                        onClick={() => getVariantByFilter(dispatch, `?productId=${params.slug}`)}
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
                loading={isFetching}
                pagination={{ pageSize: 6 }}
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
                <p>Do you want to delete variant ?</p>
            </Modal>
        </Space>
    )
}

export default ManageVariants