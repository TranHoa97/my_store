import React, { useEffect, useState } from 'react'
import { Space, Col, Button, Table, Row, Input, Select, Modal,Typography } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import _ from "lodash"
import { debounce } from "lodash";

import BrandDrawer from '../../components/brand/BrandDrawer'
import { openNotification } from '../../redux/slice/notificationSlice'
import { getBrandsByFilter } from '../../redux/brand/brandRequest'
import { getAllCategories } from '../../redux/category/categoryRequest'
import brandApi from '../../services/BrandApi'
import { setMenu } from '../../redux/slice/menuSiderSlice'

const { Search } = Input;

const ManageBrand = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation()
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const isFetching = useSelector(state => state.brand.isFetching)
    const categories = useSelector(state => state.category.value)?.map(item => {
        return { value: item.id, label: item.label }
    })
    const brands = useSelector(state => state.brand.value)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [brand, setBrand] = useState(null)
    const [loading, setLoading] = useState(null)

    const columns = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Brand Name',
            dataIndex: 'label',
            key: 'label',
            render: (text) => <div style={{ textTransform: "capitalize" }}>{text}</div>
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
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

    const showDrawer = (action, record) => {
        const checkPermission = account.find(item => item.url === "/brand/create" || item.url === "/brand/update")
        if(checkPermission) {
            setIsDrawerOpen(true)
            setAction(action)
            setBrand(record)
        } else {
            navigate(`/error/403`)
        }
    }

    const showModal = (record) => {
        setIsModalOpen(true)
        setBrand(record)
    }

    const handleDelete = async () => {
        setLoading(true)
        const res = await brandApi.deleteBrand(brand.id)
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
        getBrandsByFilter(dispatch, location.search)
    }

    useEffect(() => {
        dispatch(setMenu(["6"]))
        getAllCategories(dispatch)
    }, [])

    useEffect(() => {
        refreshData()
    }, [searchParams])

    return (
        <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Typography.Title level={3}>Manage Brand</Typography.Title>
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
                        placeholder="input search brand name"
                        allowClear
                        onChange={handleSearch}
                        enterButton
                        defaultValue={search}
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={brands}
                pagination={{ pageSize: 8 }}
                loading={isFetching}
            />


            <BrandDrawer
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                action={action}
                category={categories}
                data={brand}
            />

            <Modal
                title={"Delete Brand"}
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

export default ManageBrand