import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Col, Button, Table, Row, Modal, Typography, Input } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'

import { getAllGroups } from '../../redux/group/groupRequest'
import groupApi from '../../services/GroupApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import GroupDrawer from '../../components/group/GroupDrawer'
import { getAllRoles } from '../../redux/roles/roleRequest'
import { setMenu } from '../../redux/slice/menuSiderSlice'
import { useNavigate } from 'react-router-dom'

const { Search } = Input;

const ManageGroup = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isFetching = useSelector(state => state.group.isFetching)
    const groups = useSelector(state => state.group.value)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const roles = useSelector(state => state.roles.value)
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
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
            title: 'Group Name',
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
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

    const showModal = (record) => {
        setIsModalOpen(true);
        setUpdateData(record)
    };

    const showDrawer = async (action, record) => {
        const checkPermission = account.find(item => item.url === "/group/create" || item.url === "/group/update")
        if (checkPermission) {
            setIsDrawerOpen(true)
            setAction(action)
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        const res = await groupApi.deleteGroup(updateData.id)
        if (res.st === 1) {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            await getAllGroups(dispatch)
        } else {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
        }
    }

    useEffect(() => {
        getAllGroups(dispatch)
        getAllRoles(dispatch)
        dispatch(setMenu(["3"]))
    }, [])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Group</Typography.Title>
                <Space size={"middle"}>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => getAllGroups(dispatch)}
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
                dataSource={groups}
                loading={isFetching}
            />

            <GroupDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                action={action}
                roles={roles}
                data={updateData}
            />

            <Modal
                title={"Delete Group"}
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                style={{ top: 20 }}
                confirmLoading={loading}
            >
                <p>Do you want to delete user ?</p>
            </Modal>
        </Space>
    )
}

export default ManageGroup