import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Button, Table, Row, Modal, Typography, Col, Input } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'

import CategoryDrawer from '../../components/category/CategoryDrawer'
import categoryApi from '../../services/CategoryApi'
import { getCategoryByFilter } from '../../redux/category/categoryRequest'
import { openNotification } from '../../redux/slice/notificationSlice'
import { setMenu } from '../../redux/slice/menuSiderSlice'
import { formatDate } from '../../ultis/formatDate'

const ManageCategory = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    let [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page")
    const search = searchParams.get("search")

    const isFetching = useSelector(state => state.category.isFetching)
    const categories = useSelector(state => state.category.value?.data)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const pagination = useSelector(state => state.category.value?.pagination)
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [updateData, setUpdateData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [filter, setFilter] = useState({
        page: page ? +page : 1,
        limit: 4
    })

    const columns = [
        {
            title: 'CategoryId',
            dataIndex: 'id',
        },
        {
            title: 'Image',
            dataIndex: 'image_url',
            render: (url) => <img style={{ width: "50px" }} src={url} alt="image" />
        },
        {
            title: 'Icon',
            dataIndex: 'icon_url',
            render: (url) => <img style={{ width: "50px" }} src={url} alt="icon" />
        },
        {
            title: 'Category Name',
            dataIndex: 'label',
            render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
        },
        {
            title: "UpdatedAt",
            dataIndex: "updatedAt",
            render: (text) => <div>{formatDate(text)}</div>
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showDrawer("update", record)}>Update</a>
                    <a onClick={() => showModal(record)}>Delete</a>
                </Space>
            ),
        },
    ]

    const showDrawer = (action, record) => {
        const checkPermissionCreate = account.find(item => item.url === "/category/create")
        const checkPermissionUpdate = account.find(item => item.url === "/category/update")
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
        const checkPermissionDelete = account.find(item => item.url === "/category/delete")
        if (checkPermissionDelete) {
            setIsModalOpen(true);
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    }

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
                    setFilter({ ...others, page: 1 })
                    newFilter = { ...others, page: 1 }
                }
                break;
        }
        setSearchParams(newFilter)
    }, 500)

    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await categoryApi.deleteCateogry(updateData.id)
            if (res.st === 1) {
                setLoading(false)
                setIsModalOpen(false)
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                if (+page === 1) {
                    await getCategoryByFilter(dispatch, `?page=1&limit=${filter.limit}`)
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
        dispatch(setMenu(["7"]))
    }, [])

    useEffect(() => {
        if (location.search) {
            getCategoryByFilter(dispatch, location.search)
        } else {
            getCategoryByFilter(dispatch, `?page=1&limit=${filter.limit}`)
        }
    }, [searchParams])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Category</Typography.Title>
                <Space size={"middle"}>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => getCategoryByFilter(dispatch, location.search ? location.search : `?page=1&limit=${filter.limit}`)}
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
                        placeholder="input search category label, slug, id..."
                        onChange={(e) => handleChange("search", e)}
                        defaultValue={search}
                        allowClear
                        enterButton
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={categories}
                loading={isFetching}
                pagination={{
                    pageSize: filter.limit ? filter.limit : 8,
                    current: page ? +page : 1,
                    total: pagination?.total,
                    onChange: (e) => handleChange("pagination", e)
                }}
            />

            <CategoryDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                action={action}
                data={updateData}
                limit={filter.limit}
            />

            <Modal
                title={"Delete Category"}
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={loading}
                style={{ top: 20 }}
            >
                <p>Do you want to delete category ?</p>
            </Modal>
        </Space>
    )
}

export default ManageCategory