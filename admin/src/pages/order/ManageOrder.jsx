import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Col, Button, Table, Row, Modal, Typography, Input, Select } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import _ from "lodash"
import { debounce } from "lodash";

import { setMenu } from '../../redux/slice/menuSiderSlice'
import { getAllVariants } from '../../redux/variants/variantsRequest'
import orderApi from '../../services/OrderApi'
import { openNotification } from '../../redux/slice/notificationSlice'
import { formatDate } from '../../ultis/formatDate'
import UpdateOrder from './UpdateOrder'
import { getOrdersByFilter } from '../../redux/order/orderRequest'
import numberWithCommas from '../../ultis/numberWithCommas'

const { Search } = Input;

const ManageOrder = () => {

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const isFetching = useSelector(state => state.order.isFetching)
    const orders = useSelector(state => state.order.value)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            title: 'OrderId',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Customer Name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Customer Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Date Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => <div>{formatDate(text)}</div>
        },
        {
            title: 'Total Products',
            dataIndex: 'total_quantity',
            key: 'total_quantity',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (text) => <div>{numberWithCommas(text)}</div>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showUpdate(record)}>Update</a>
                    <a onClick={() => showModal(record)}>Delete</a>
                </Space>
            ),
        },
    ]

    const showAdd = () => {
        const checkPermission = account.find(item => item.url === "/orders/create" || item.url === "/orders/update")
        if (checkPermission) {
            navigate(`/orders/add`)
        } else {
            navigate(`/error/403`)
        }
    }

    const showUpdate = (record) => {
        const checkPermission = account.find(item => item.url === "/orders/create" || item.url === "/orders/update")
        if (checkPermission) {
            setIsUpdateOpen(true);
            setOrder(record)
        } else {
            navigate(`/error/403`)
        }
    };

    const showModal = (record) => {
        setIsModalOpen(true);
        setOrder(record)
    };

    const handleDelete = async () => {
        setLoading(true)
        const res = await orderApi.deleteOrder(order.id)
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

    const handleSearch = debounce(async (e) => {
        let keyword = e.target.value.toLowerCase().replaceAll(" ", "-")
        if (status) {
            setSearchParams({ status: status, search: keyword })
        } else {
            setSearchParams({ search: keyword })
        }
    }, 1000)

    const handleChange = (e) => {
        let str = e.replaceAll(" ", "-")
        if (e === "all") {
            if (search) {
                setSearchParams({ search: search })
            } else {
                setSearchParams({})
            }
        } else {
            if (search) {
                setSearchParams({ status: str, search: search })
            } else {
                setSearchParams({ status: str })
            }
        }
    }

    const refreshData = () => {
        getOrdersByFilter(dispatch, location.search)
    }

    useEffect(() => {
        dispatch(setMenu(["12", "sub4"]))
        getAllVariants(dispatch)
    }, [])

    useEffect(() => {
        refreshData()
    }, [searchParams])

    return (
        <>
            {
                isUpdateOpen ? (
                    <UpdateOrder
                        data={order}
                        onClose={() => setIsUpdateOpen(false)}
                    />
                ) : (
                    <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
                        <Row justify={"space-between"}>
                            <Typography.Title level={3}>Manage Orders</Typography.Title>
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
                                    onClick={showAdd}
                                >
                                    Add new
                                </Button>
                            </Space>
                        </Row>
                        <Row justify={"space-between"}>
                            <Col>
                                <Row align={"middle"} gutter={[16, 0]}>
                                    <Col>Status:</Col>
                                    <Select
                                        placeholder={`Please Select...`}
                                        options={[
                                            { value: "Đang xử lý", label: "Đang xử lý" },
                                            { value: "Đang vận chuyển", label: "Đang vận chuyển" },
                                            { value: "Đã xong", label: "Đã xong" },
                                            { value: "all", label: "all" },
                                        ]}
                                        onChange={handleChange}
                                        value={status ? status.replaceAll("-", " ") : "all"}
                                        style={{ minWidth: "200px", textTransform: "capitalize" }}
                                    />
                                </Row>
                            </Col>
                            <Col span={10}>
                                <Search
                                    placeholder="input search customer name..."
                                    allowClear
                                    onChange={handleSearch}
                                    enterButton
                                    defaultValue={search}
                                />
                            </Col>
                        </Row>
                        <Table
                            columns={columns}
                            dataSource={orders}
                            pagination={{ pageSize: 6 }}
                            loading={isFetching}
                        />
                        <Modal
                            title={"Delete Order"}
                            open={isModalOpen}
                            onCancel={() => setIsModalOpen(false)}
                            onOk={handleDelete}
                            style={{ top: 20 }}
                            confirmLoading={loading}
                        >
                            <p>Do you want to delete order ?</p>
                        </Modal>
                    </Space>
                )
            }
        </>
    )
}

export default ManageOrder