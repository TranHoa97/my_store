import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { Space, Col, Button, Table, Row, Input, Select, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { debounce } from "lodash";

import AttributesDrawer from '../../components/attributes/AttributesDrawer'
import { getAttributesByFilter } from '../../redux/attributes/attributesRequest'
import { getCategoryByFilter } from '../../redux/category/categoryRequest'
import { openNotification } from '../../redux/slice/notificationSlice'
import attributesApi from '../../services/AttributesApi'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const { Search } = Input;

const ManageAttributes = () => {

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = searchParams.get("page")

    const isFetching = useSelector(state => state.attributes.attributes.isFetching)
    const attributes = useSelector(state => state.attributes.attributes.value?.data)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const categories = useSelector(state => state.category.value?.data)?.map(item => {
        return { value: item.id, label: item.label }
    })
    const pagination = useSelector(state => state.attributes.attributes.value?.pagination)
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [action, setAction] = useState(null)
    const [updateData, setUpdateData] = useState(null)
    const [filter, setFilter] = useState({
        page: +page || 1,
        limit: 6
    })

    const columns = [
        {
            title: 'AttributeId',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Attributes Name',
            dataIndex: 'label',
            key: 'label',
            render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
        },
        {
            title: 'Category Name',
            dataIndex: 'category_label',
            key: 'category_label',
            render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/attributes/addvalue/${record.id}`}>+ Add Value</Link>
                    <a onClick={() => showDrawer("update", record)}>Update</a>
                    <a onClick={() => showModal(record)}>Delete</a>
                </Space>
            ),
        },
    ]

    const showDrawer = (action, record) => {
        const checkPermissionCreate = account.find(item => item.url === "/attributes/create")
        const checkPermissionUpdate = account.find(item => item.url === "/attributes/update")
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
        const checkPermissionDelete = account.find(item => item.url === "/attributes/delete")
        if (checkPermissionDelete) {
            setIsModalOpen(true);
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const handleChange = debounce((type, e) => {
        // console.log(e);
        let newFilter = filter
        switch (type) {
            case "pagination":
                setFilter({ ...filter, page: e })
                newFilter = { ...filter, page: e }
                break;
            case "category":
                if (e === "all") {
                    let { category, ...others } = filter
                    setFilter({ ...others, page: 1 })
                    newFilter = { ...others, page: 1 }
                } else {
                    setFilter({ ...filter, page: 1, category: e })
                    newFilter = { ...filter, page: 1, category: e }
                }
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
            const res = await attributesApi.deleteAttributes(updateData.id)
            if (res.st === 1) {
                setLoading(false)
                setIsModalOpen(false)
                dispatch(openNotification(
                    { type: "success", message: res.msg, duration: 2, open: true }
                ))
                if(updateData.category_id === +category) {
                    getAttributesByFilter(dispatch, `?page=1&limit=${filter.limit}&category=${updateData.category_id}`)
                } else {
                    setSearchParams({ page: 1, limit: filter.limit, category: updateData.category_id })
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
        dispatch(setMenu(["8"]))
        getCategoryByFilter(dispatch)
    }, [])

    useEffect(() => {
        if(location.search) {
            getAttributesByFilter(dispatch, location.search)
        } else {
            getAttributesByFilter(dispatch, `?page=1&limit=${filter.limit}`)
        }
    }, [searchParams])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Attributes</Typography.Title>
                <Space size={"middle"}>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => getAttributesByFilter(dispatch, location.search ? location.search : `?page=1&limit=${filter.limit}`)}
                    >
                        Refresh
                    </Button>
                    <Button
                        type='primary'
                        size='middle'
                        icon={<PlusOutlined />}
                        onClick={() => showDrawer("create")}
                    >
                        Add new
                    </Button>
                </Space>
            </Row>
            <Row justify={"space-between"}>
                <Col>
                    <Row align={"middle"} gutter={[16, 0]}>
                        <Col>Category:</Col>
                        <Select
                            placeholder={`Please Select...`}
                            options={categories ? [...categories, { value: "all", label: "all" }] : []}
                            value={category ? +category : "all"}
                            onChange={(e) => handleChange("category", e)}
                            style={{ minWidth: "200px", textTransform: "capitalize" }}
                        />
                    </Row>
                </Col>
                <Col span={12}>
                    <Search
                        placeholder="input search attributes label, slug, id..."
                        defaultValue={search}
                        onChange={(e) => handleChange("search", e)}
                        allowClear
                        enterButton
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={attributes}
                loading={isFetching}
                pagination={{
                    pageSize: filter.limit ? filter.limit : 8,
                    current: page ? +page : 1,
                    total: pagination?.total || 1,
                    onChange: (e) => handleChange("pagination", e)
                }}
            />

            <AttributesDrawer
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                action={action}
                category={categories}
                data={updateData}
                limit={filter.limit}
            />

            <Modal
                title={"Delete Attributes"}
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={loading}
                style={{ top: 20 }}
            >
                <p>Do you want to delete attributes ?</p>
            </Modal>
        </Space>
    )
}

export default ManageAttributes