import React, { useEffect, useState } from 'react'
import { Col, Row, Typography, Table } from 'antd';
import DashboardCard from '../../components/dashboard/DashboardCard';
import {
  ShoppingCartOutlined,
  ShoppingOutlined, UserOutlined,
  DollarOutlined
} from '@ant-design/icons';

import { useDispatch } from 'react-redux';
import dashboardApi from '../../services/DashboardApi';
import { openNotification } from '../../redux/slice/notificationSlice';
import { formatDate } from '../../ultis/formatDate';
import numberWithCommas from '../../ultis/numberWithCommas';
import { setMenu } from '../../redux/slice/menuSiderSlice';

const Dashboard = () => {

  const dispatch = useDispatch()

  const [dashboard, setDashboard] = useState({})
  const [recentOrders, setRecentOrders] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDataDashboard = async () => {
    try {
      const res = await dashboardApi.getDataDashboard()
      if (res.st === 1) {
        setDashboard(res.data)
      } else {
        dispatch(openNotification(
          { type: "error", message: res.msg, duration: 2, open: true }
        ))
      }
    } catch (err) {
      dispatch(openNotification(
        { type: "error", message: "Something wrong!", duration: 2, open: true }
      ))
      setLoading(false)
    }
  }

  const fetchRecentOrders = async () => {
    try {
      setLoading(true)
      const res = await dashboardApi.getRecentOrders()
      if (res.st === 1) {
        const results = res.data.map((item, index) => {
          return { ...item, key: index + 1 }
        })
        setRecentOrders(results)
        setLoading(false)
      } else {
        dispatch(openNotification(
          { type: "error", message: res.msg, duration: 2, open: true }
        ))
        setLoading(false)
      }
    } catch (err) {
      dispatch(openNotification(
        { type: "error", message: "Something wrong!", duration: 2, open: true }
      ))
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataDashboard()
    fetchRecentOrders()
    dispatch(setMenu(["1"]))
  }, [])

  return (
    <>
      <Typography.Title level={3}>Manage User</Typography.Title>
      <Row justify={"space-between"} gutter={[15, 0]}>
        <Col span={6}>
          <DashboardCard
            title="Orders"
            value={dashboard.totalOrder || 0}
            icon={
              <ShoppingCartOutlined
                style={{
                  color: "green",
                  background: "rgba(0,255,0,0.5)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8
                }}
              />
            }
          />
        </Col>
        <Col span={6}>
          <DashboardCard
            title="Inventory"
            value={dashboard.totalInventory || 0}
            icon={
              <ShoppingOutlined
                style={{
                  color: "blue",
                  background: "rgba(0,0,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8
                }}
              />
            }
          />
        </Col>
        <Col span={6}>
          <DashboardCard
            title="Customer"
            value={dashboard.totalUser || 0}
            icon={
              <UserOutlined
                style={{
                  color: "purple",
                  background: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8
                }}
              />
            }
          />
        </Col>
        <Col span={6}>
          <DashboardCard
            title="Revenue"
            value={dashboard.totalRevenue || 0}
            icon={
              <DollarOutlined
                style={{
                  color: "red",
                  background: "rgba(255,0,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8
                }}
              />
            }
          />
        </Col>
      </Row>

      <Typography.Title level={5}>Recent Orders</Typography.Title>
      <Row>
        <Col span={24}>
          <Table
            columns={[
              {
                title: "Title",
                dataIndex: "username"
              },
              {
                title: "Quantity",
                dataIndex: "total_quantity"
              },
              {
                title: "Price",
                dataIndex: "total_price",
                render: (text) => <div>{numberWithCommas(Number(text))}</div>
              },
              {
                title: "Status",
                dataIndex: "status"
              },
              {
                title: "Date Time",
                dataIndex: "updatedAt",
                render: (text) => <div>{formatDate(text)}</div>
              },
            ]}
            dataSource={recentOrders}
            loading={loading}
            pagination={false}
          />
        </Col>
      </Row>
    </>
  )
}

export default Dashboard