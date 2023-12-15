import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams,useLocation, useNavigate } from 'react-router-dom'
import { Space, Col, Button, Table, Row, Input, Select, Modal, Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import _ from "lodash"
import { debounce } from "lodash";

import AttributesDrawer from '../../components/attributes/AttributesDrawer'
import { getAttributesByFilter } from '../../redux/attributes/attributesRequest'
import { getAllCategories } from '../../redux/category/categoryRequest'
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

    const isFetching = useSelector(state => state.attributes.attributes.isFetching)
    const attributes = useSelector(state => state.attributes.attributes.value)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const categories = useSelector(state => state.category.value)?.map(item => {
        return { value: item.id, label: item.label }
    })
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [updateData, setUpdateData] = useState(null)
    const [loading, setLoading] = useState(null)

    const columns = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'key',
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
        const checkPermission = account.find(item => item.url === "/attributes/create" || item.url === "/attributes/update")
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
        const res = await attributesApi.deleteAttributes(updateData.id)
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

    const handleSearch = debounce(async(e) => {
        let keyword = e.target.value.toLowerCase().replaceAll(" ", "-")
        if(category) {
            setSearchParams({ category: category, search: keyword })
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
                setSearchParams({ category: e, search: search })
            } else {
                setSearchParams({ category: e })
            }
        }
    }

    const refreshData = () => {
        getAttributesByFilter(dispatch, location.search)
    }

    useEffect(() => {
        dispatch(setMenu(["8"]))
        getAllCategories(dispatch)
    }, [])

    useEffect(() => {
        refreshData()
    }, [searchParams])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Attributes</Typography.Title>
                <Space size={"middle"}>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => refreshData()}
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
                            onChange={handleChange}
                            value={category ? Number(category) : "all"}
                            style={{ minWidth: "200px", textTransform: "capitalize" }}
                        />
                    </Row>
                </Col>
                <Col span={10}>
                    <Search
                        placeholder="input search attributes name"
                        allowClear
                        onChange={handleSearch}
                        enterButton
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={attributes}
                pagination={{ pageSize: 8 }}
                loading={isFetching}
            />

            <AttributesDrawer
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                action={action}
                category={categories}
                data={updateData}
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