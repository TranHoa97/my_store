import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Row, Col, Space, Layout } from 'antd';
import { loginUser } from "../../redux/auth/authRequest";
import { useDispatch } from "react-redux";

const LoginPage = () => {

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogin = async (values) => {
        await loginUser(dispatch, navigate, values)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        form.setFieldsValue({
            username: "admin",
            password: 123456789
        })
    }, [])

    return (
        <div 
            style={{ 
                position:"fixed", 
                top: "0", 
                left:"0", 
                width: "100%", 
                minHeight: "100vh", 
                zIndex:"99",
                background: "#fff"
                }}
        >
            <Space
                direction={"vertical"}
                size={"middle"}
                style={{
                    width: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Row
                    justify={"center"}
                    align={"middle"}
                    gutter={[0, 25]}
                >
                    <Col span={24}>
                        <div
                            style={{
                                color: "#000",
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                fontSize: "30px",
                                textAlign: "center",
                                color: "#1677ff"
                            }}
                        >
                            Login
                        </div>
                    </Col>
                    <Col span={8}>
                        <Form
                            form={form}
                            onFinish={handleLogin}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            {/* Username */}
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username or email!',
                                    },
                                ]}
                            >
                                <Input placeholder="Email or Username...." />
                            </Form.Item>
                            {/* Password */}
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Password..." />
                            </Form.Item>

                            {/* Submit */}
                            <Form.Item>
                                <Row justify={"center"}>
                                    <Button type="primary" htmlType="submit">
                                        Log in
                                    </Button>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col span={24}>
                        <Row justify={"center"} gutter={[15, 0]}>
                            <Col>Don't have an account?</Col>
                            <Col><Link to={"/register"}>Sign up</Link></Col>
                        </Row>
                    </Col>

                    <Col>
                        <Row justify={"center"}>
                            <Col><Link>Forgot password?</Link></Col>
                        </Row>
                    </Col>
                </Row>
            </Space>
        </div>
    )
}

export default LoginPage