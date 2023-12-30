import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Space, Button, Table, Row, Modal, Typography, Col, Input } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'

import GroupDrawer from '../../components/group/GroupDrawer'
import groupApi from '../../services/GroupApi'
import { getGroupByFilter } from '../../redux/group/groupRequest'
import { getAllRoles } from '../../redux/roles/roleRequest'
import { openNotification } from '../../redux/slice/notificationSlice'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const ManageGroup = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    let [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page")
    const search = searchParams.get("search")

    const isFetching = useSelector(state => state.group.isFetching)
    const groups = useSelector(state => state.group.value?.data)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const pagination = useSelector(state => state.group.value?.pagination)
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [updateData, setUpdateData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState({
        page: page ? +page : 1,
        limit: 6
    })

    const columns = [
        {
            title: 'GroupId',
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

    const showDrawer = async (action, record) => {
        const checkPermissionCreate = account.find(item => item.url === "/group/create")
        const checkPermissionUpdate = account.find(item => item.url === "/group/update")
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
        const checkPermissionDelete = account.find(item => item.url === "/group/delete")
        if(checkPermissionDelete) {
            setIsModalOpen(true);
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    };

    const handleChange = debounce(async (type, e) => {
        let newFilter = filter
        switch (type) {
            case "pagination":
                setFilter({ ...filter, page: e })
                newFilter = { ...filter, page: e }
                break;
            case "search":
                let keyword = e.target.value
                if (keyword) {
                    setFilter({ ...filter, page: 1, search: keyword })
                    newFilter = { ...filter, page: 1, search: keyword }
                } else {
                    let { search, ...others } = filter
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
            const res = await groupApi.deleteGroup(updateData.id)
            if (res.st === 1) {
                setLoading(false)
                setIsModalOpen(false)
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                if (+page === 1) {
                    await getGroupByFilter(dispatch, `?page=1&limit=${filter.limit}`)
                } else {
                    setSearchParams({ page: 1, limit: filter.limit })
                }
            } else {
                setLoading(false)
                setIsModalOpen(false)
                dispatch(openNotification(
                    { type: "error", message: res.msg, duration: 2, open: true }
                ))
            }
        } catch (err) {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "error", message: "Something wrong!", duration: 2, open: true }
            ))
        }
    }

    useEffect(() => {
        dispatch(setMenu(["3"]))
        getAllRoles(dispatch)
    }, [])

    useEffect(() => {
        if (location.search) {
            getGroupByFilter(dispatch, location.search)
        } else {
            getGroupByFilter(dispatch, `?page=1&limit=${filter.limit}`)
        }
    }, [searchParams])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Group</Typography.Title>
                <Space size={"middle"}>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => getGroupByFilter(dispatch, location.search ? location.search : `?page=1&limit=${filter.limit}`)}
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
            <Row justify={"end"}>
                <Col span={12}>
                    <Input.Search
                        placeholder="input search group label, id..."
                        onChange={(e) => handleChange("search", e)}
                        defaultValue={search}
                        allowClear
                        enterButton
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={groups}
                loading={isFetching}
                pagination={{
                    pageSize: filter.limit ? filter.limit : 4,
                    current: page ? +page : 1,
                    total: pagination?.total,
                    onChange: (e) => handleChange("pagination", e)
                }}
            />

            <GroupDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                action={action}
                data={updateData}
                limit={filter.limit}
            />

            <Modal
                title={"Delete Group"}
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                style={{ top: 20 }}
                confirmLoading={loading}
            >
                <p>Do you want to delete group ?</p>
            </Modal>
        </Space>
    )
}

export default ManageGroup