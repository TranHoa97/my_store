import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Col, Button, Table, Row, Modal, Typography, Input, Select } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { debounce } from "lodash";

import { setMenu } from '../../redux/slice/menuSiderSlice'
import { getVariantByFilter } from '../../redux/variants/variantsRequest'
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
    const page = searchParams.get("page")

    const isFetching = useSelector(state => state.order.isFetching)
    const orders = useSelector(state => state.order.value?.data)?.map((item, index) => {
        return { ...item, key: index + 1 }
    })
    const pagination = useSelector(state => state.order.value?.pagination)
    const account = useSelector(state => state.auth.login.value).groupWithRoles.roles

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [updateData, setUpdateData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState({
        page: page ? +page : 1,
        limit: 6,
    })

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
            render: (text) => <div>{text ? text : 0}</div>
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (text) => <div>{text ? numberWithCommas(Number(text)) : 0}</div>
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
        const checkPermission = account.find(item => item.url === "/orders/create")
        if (checkPermission) {
            navigate(`/orders/add`)
        } else {
            navigate(`/error/403`)
        }
    }

    const showUpdate = (record) => {
        const checkPermission = account.find(item => item.url === "/orders/update")
        if (checkPermission) {
            setIsUpdateOpen(true);
            setUpdateData(record)
        } else {
            navigate(`/error/403`)
        }
    };

    const showModal = (record) => {
        const checkPermission = account.find(item => item.url === "/orders/update")
        if (checkPermission) {
            setIsModalOpen(true);
            setUpdateData(record)
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
                newFilter = { ...filter, page: e }
                break;
            case "status":
                if (e === "all") {
                    let { status, ...others } = filter
                    setFilter({ ...others, page: 1 })
                    newFilter = { ...others, page: 1 }
                } else {
                    setFilter({ ...filter, page: 1, status: e })
                    newFilter = { ...filter, page: 1, status: e }
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
        setLoading(true)
        const res = await orderApi.deleteOrder(updateData.id)
        if (res.st === 1) {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            if (updateData.status === status) {
                await getOrdersByFilter(dispatch, `?page=1&limit=${filter.limit}&status=${updateData.status}`)
            } else {
                setSearchParams({ page: 1, limit: filter.limit, status: updateData.status })
            }
        } else {
            setLoading(false)
            setIsModalOpen(false)
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
        }
    }

    useEffect(() => {
        dispatch(setMenu(["12", "sub4"]))
        getVariantByFilter(dispatch)
    }, [])

    useEffect(() => {
        if (location.search) {
            getOrdersByFilter(dispatch, location.search)
        } else {
            getOrdersByFilter(dispatch, `?page=1&limit=${filter.limit}`)
        }
    }, [searchParams])

    return (
        <>
            {
                isUpdateOpen ? (
                    <UpdateOrder
                        data={updateData}
                        onClose={() => setIsUpdateOpen(false)}
                        limit={filter.limit}
                    />
                ) : (
                    <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
                        <Row justify={"space-between"}>
                            <Typography.Title level={3}>Manage Orders</Typography.Title>
                            <Space size={"middle"}>
                                <Button
                                    icon={<RedoOutlined />}
                                    onClick={() => getOrdersByFilter(dispatch, location.search ? location.search : `?page=1&limit=${filter.limit}`)}
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
                                        onChange={(e) => handleChange("status", e)}
                                        value={status ? status : "all"}
                                        style={{ minWidth: "200px", textTransform: "capitalize" }}
                                    />
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Search
                                    placeholder="input search customer name, phone, address..."
                                    onChange={(e) => handleChange("search", e)}
                                    defaultValue={search}
                                    allowClear
                                    enterButton
                                />
                            </Col>
                        </Row>
                        <Table
                            columns={columns}
                            dataSource={orders}
                            loading={isFetching}
                            pagination={{
                                pageSize: filter.limit ? filter.limit : 6,
                                current: page ? +page : 1,
                                total: pagination?.total,
                                onChange: (e) => handleChange("pagination", e)
                            }}
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