import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { Space, Col, Button, Table, Row, Spin, Select, Input, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { debounce } from "lodash";

import { getUsersByFilter } from '../../redux/user/userRequest'
import { getGroupByFilter } from '../../redux/group/groupRequest'
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
    const page = searchParams.get("page")

    const isFetching = useSelector(state => state.user.isFetching)
    const users = useSelector(state => state.user.value?.data)?.map((item,index) => {
        return { ...item, key: index + 1 }
    })
    const groups = useSelector(state => state.group.value?.data)?.map(item => {
        return { value: item.id, label: item.label }
    })
    const pagination = useSelector(state => state.user.value?.pagination)
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [action, setAction] = useState(null)
    const [user, setUser] = useState(null)
    const [filter, setFilter] = useState({
        page: +page || 1,
        limit: 6,
    })

    const columns = [
        {
            title: 'UserId',
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
        const checkPermissionCreate = account.find(item => item.url === "/user/create")
        const checkPermissionUpdate = account.find(item => item.url === "/user/update")
        if(checkPermissionCreate) {
            setIsDrawerOpen(true)
            setAction(action)
        } else {
            navigate(`/error/403`)
        }
        if(checkPermissionUpdate) {
            setIsDrawerOpen(true)
            setAction(action)
            setUser(record)
        } else {
            navigate(`/error/403`)
        }
    } 

    const showModal = (record) => {
        const checkPermissionDelete = account.find(item => item.url === "/user/delete")
        if(checkPermissionDelete) {
            setIsModalOpen(true);
            setUser(record)
        } else {
            navigate(`/error/403`)
        }
    };

    const handleChange = debounce((type, e) => {
        // console.log(e);
        let newFilter = filter
        switch (type) {
            case "pagination":
                setFilter({ ...filter, page: e })
                newFilter = {...filter, page: e}
                break;
            case "group":
                if(e === "all") {
                    let {group, ...others} = filter
                    setFilter({...others, page: 1})
                    newFilter = {...others, page: 1}
                } else {
                    setFilter({ ...filter, page: 1, group: e })
                    newFilter = { ...filter, page: 1, group: e }
                }
                break;
            case "search":
                let keyword = e.target.value
                if(keyword) {
                    setFilter({ ...filter, page: 1, search: keyword })
                    newFilter = { ...filter, page: 1, search: keyword }
                } else {
                    let {search, ...others} = filter
                    setFilter({...others, page: 1})
                    newFilter = {...others, page: 1}
                }
                break;
        }
        setSearchParams(newFilter)
    }, 500)
    
    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await userApi.deleteUser(user.id)
            if (res.st === 1) {
                setLoading(false)
                setIsModalOpen(false)
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                if(user.group_id === +group) {
                    getUsersByFilter(dispatch, `?page=1&limit=${filter.limit}&group=${user.group_id}`)
                } else {
                    setSearchParams({ page: 1, limit: filter.limit, group: user.group_id })
                }
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
        dispatch(setMenu(["2"]))
        getGroupByFilter(dispatch)
    }, [])

    useEffect(() => {
        if(location.search) {
            getUsersByFilter(dispatch, location.search)
        } else {
            getUsersByFilter(dispatch, `?page=1&limit=${filter.limit}`)
        }
    }, [searchParams])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage User</Typography.Title>
                <Space size={"middle"}>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => getUsersByFilter(dispatch, location.search ? location.search : `?page=1&limit=${filter.limit}`)}
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
                        style={{ minWidth: "200px", textTransform: "capitalize" }}
                        placeholder={`Please Select...`}
                        options={groups ? [...groups, { value: "all", label: "all" }] : []}
                        value={group ? +group : "all"}
                        onChange={(e) => handleChange("group", e)}
                    />
                </Row>
                <Col span={12}>
                    <Search
                        placeholder="input search username, email, phone..."
                        onChange={(e) => handleChange("search", e)}
                        defaultValue={search}
                        allowClear
                        enterButton
                    />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={users}
                loading={isFetching}
                pagination={{ 
                    pageSize: filter.limit ? filter.limit : 8,
                    current: page ? +page : 1,
                    total: pagination?.total || 1,
                    onChange: (e) => handleChange("pagination", e)
                }}
            />

            <UserDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                action={action}
                groups={groups}
                data={user}
                limit={filter.limit}
            />

            <Modal
                style={{ top: 20 }}
                title={"Delete User"}
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={loading}
            >
                <p>Do you want to delete user ?</p>
            </Modal>
        </Space>
    )
}

export default ManageUser