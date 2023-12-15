import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { Space, Col, Button, Table, Row, Spin, Select, Input, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import _ from "lodash"
import { debounce } from "lodash";

import { getUsersByFilter } from '../../redux/user/userRequest'
import { getAllGroups } from '../../redux/group/groupRequest'
import { openNotification } from '../../redux/slice/notificationSlice'
import userApi from '../../services/UserApi'
import UserDrawer from '../../components/user/UserDrawer'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const { Search } = Input;

const ManageUser = () => {

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();
    const group = searchParams.get("group")
    const search = searchParams.get("search") 

    const isFetching = useSelector(state => state.user.isFetching)
    const users = useSelector(state => state.user.value)?.map((item,index) => {
        return { ...item, key: index + 1 }
    })
    const groups = useSelector(state => state.group.value)?.map(item => {
        return { value: item.id, label: item.label }
    })
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(false)

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Role',
            dataIndex: 'group_name',
            key: 'group_name',
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
        const checkPermission = account.find(item => item.url === "/user/create" || item.url === "/user/update")
        if(checkPermission) {
            setIsDrawerOpen(true)
            setAction(action)
            setUser(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const showModal = (record) => {
        setIsModalOpen(true);
        setUser(record)
    };

    const handleSearch = debounce(async(e) => {
        let keyword = e.target.value
        if(group) {
            setSearchParams({ group: group, search: keyword })
        } else {
            setSearchParams({ search: keyword })
        }
    }, 1000)

    const handleChange = (e) => {
        if(e === "all") {
            if(search) {
                setSearchParams({ search: search })
            } else {
                setSearchParams({})
            }
        } else {
            if(search) {
                setSearchParams({ group: e, search: search })
            } else {
                setSearchParams({ group: e })
            }
        }
    }

    const refreshData = () => {
        getUsersByFilter(dispatch, location.search)
    }

    const handleDelete = async () => {
        setLoading(true)
        const res = await userApi.deleteUser(user.id)
        if (res.st === 1) {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            refreshData()
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
        dispatch(setMenu(["2"]))
    }, [])

    useEffect(() => {
        refreshData()
    }, [searchParams])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage User</Typography.Title>
                <Space size={"middle"}>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => refreshData()}
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
            <Row justify={"space-between"}>
                <Row align={"middle"} gutter={[16, 0]}>
                    <Col>Groups:</Col>
                    <Select
                        placeholder={`Please Select...`}
                        options={groups ? [...groups, { value: "all", label: "all" }] : []}
                        onChange={handleChange}
                        value={Number(group) || "all"}
                        style={{ minWidth: "200px", textTransform: "capitalize" }}
                    />
                </Row>
                <Col span={10}>
                    <Search
                        placeholder="input search username, email, phone..."
                        onChange={handleSearch}
                        allowClear
                        enterButton
                    />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={users}
                pagination={{ pageSize: 8 }}
                loading={isFetching}
            />

            <UserDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                action={action}
                groups={groups}
                data={user}
            />

            <Modal
                title={"Delete User"}
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={loading}
                style={{ top: 20 }}
            >
                <p>Do you want to delete user ?</p>
            </Modal>
        </Space>
    )
}

export default ManageUser