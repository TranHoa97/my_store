import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import { Layout, theme, Row, Avatar, Col, Button, Space } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import MenuSider from './menuSider/MenuSider';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import authApi from '../services/AuthApi';

const { Header, Content, Footer, Sider } = Layout;

const LayoutContent = (props) => {

    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate()
    const user = useSelector(state => state.auth.login.value)
    const keyPath = useSelector(state => state.menu.value)

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [])

    return (
        <Layout className="layout" style={{ minHeight: "100vh" }}>
            {/* SIDER */}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div style={{
                    height: "50px",
                    lineHeight: "50px",
                    textAlign: "center",
                    color: "#fff",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    fontSize: "20px"
                }}
                >
                    {
                        collapsed ? (<HomeOutlined />) : "admin"
                    }
                </div>
                <MenuSider keyPath={keyPath} />
            </Sider>

            <Layout>
                {/* HEADER */}
                <Header style={{ padding: "0 50px 0 0", background: colorBgContainer }}>
                    <Row justify={"space-between"}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Space size={"middle"}>
                            <Avatar size={"middle"} icon={<UserOutlined />} />
                            <Col>{user ? `Hi, ${user.username}` : ""}</Col>
                        </Space>
                    </Row>
                </Header>

                {/* CONTENT */}
                <Content
                    style={{
                        margin: '24px 24px 0 24px',
                        padding: '0 24px 0 24px',
                        minHeight: '280px',
                        background: colorBgContainer
                    }}
                >
                    {props.children}
                    {/* <Outlet /> */}
                </Content>

                {/* FOOTER */}
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    )
}

export default LayoutContent