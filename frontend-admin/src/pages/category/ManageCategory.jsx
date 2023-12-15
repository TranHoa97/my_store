import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Button, Table, Row, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'

import CategoryDrawer from '../../components/category/CategoryDrawer'
import categoryApi from '../../services/CategoryApi'
import { getAllCategories } from '../../redux/category/categoryRequest'
import { openNotification } from '../../redux/slice/notificationSlice'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const ManageCategory = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isFetching = useSelector(state => state.category.isFetching)
    const categories = useSelector(state => state.category.value)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [category, setCategory] = useState(null)
    const [loading, setLoading] = useState(null)

    const columns = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Category Name',
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

    const showDrawer = (action, category) => {
        const checkPermission = account.find(item => item.url === "/category/create" || item.url === "/category/update")
        if(checkPermission) {
            setIsDrawerOpen(true)
            setAction(action)
            setCategory(category)
        } else {
            navigate(`/error/403`)
        }
    }

    const showModal = (record) => {
        setIsModalOpen(true)
        setCategory(record)
    }

    const handleDelete = async () => {
        setLoading(true)
        const res = await categoryApi.deleteCateogry(category.id)
        if (res.st === 1) {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            await getAllCategories(dispatch)
        } else {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
        }
    }

    useEffect(() => {
        dispatch(setMenu(["7"]))
        getAllCategories(dispatch)
    }, [])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Category</Typography.Title>
                <Space size={"middle"}>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => getAllCategories(dispatch)}
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
                dataSource={categories}
                pagination={{ pageSize: 8 }}
                loading={isFetching}
            />

            <CategoryDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                action={action}
                data={category}
            />

            <Modal
                title={"Delete Category"}
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

export default ManageCategory