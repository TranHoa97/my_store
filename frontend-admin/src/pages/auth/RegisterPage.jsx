import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Row, Col, Space } from 'antd';
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/auth/authRequest";
import { openNotification } from "../../redux/slice/notificationSlice";

const RegisterPage = () => {

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleRegister = async (values) => {
        if (values.password !== values.rePassword) {
            dispatch(openNotification(
                { type: "success", message: "Password and Confirm Password is not the same!", duration: 2, open: true }
            ))
        }
        registerUser(dispatch, navigate, values)
    };

    const handleRegisterFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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
                            register
                        </div>
                    </Col>
                    <Col span={10}>
                        <Form
                            form={form}
                            onFinish={handleRegister}
                            onFinishFailed={handleRegisterFailed}
                            autoComplete="off"
                            layout="vertical"
                        >
                            {/* Username */}
                            <Form.Item
                                label="Username:"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input placeholder="Username..." />
                            </Form.Item>

                            {/* Email */}
                            <Form.Item
                                label="Email:"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input placeholder="Email..." />
                            </Form.Item>

                            {/* Phone Number */}
                            <Form.Item
                                label="Phone Number:"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input placeholder="Phone number..." />
                            </Form.Item>

                            {/* Addresss */}
                            <Form.Item
                                label="Addresss:"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your address!',
                                    },
                                ]}
                            >
                                <Input placeholder="Phone number..." />
                            </Form.Item>

                            {/* Password */}
                            <Form.Item
                                label="Password:"
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

                            {/* Confirm Password */}
                            <Form.Item
                                label="Confirm Password:"
                                name="rePassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Confirm Password..." />
                            </Form.Item>

                            {/* Submit */}
                            <Form.Item>
                                <Row justify={"center"}>
                                    <Col>
                                        <Button type="primary" htmlType="submit">
                                            Create account
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col span={24}>
                        <Row justify={"center"}>
                            <Col><Link to={"/login"}>Go Back</Link></Col>
                        </Row>
                    </Col>
                </Row>
            </Space>
        </div>
    )
}

export default RegisterPage