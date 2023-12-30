import React, { useEffect, useState } from 'react'
import { Menu } from 'antd';
import {
    SettingOutlined,
    UserOutlined,
    ShopOutlined,
    LogoutOutlined,
    ClusterOutlined,
    DollarOutlined,
    CopyOutlined,
    TagsOutlined,
    FileImageOutlined,
    PieChartOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { logoutUser } from '../../redux/auth/authRequest';

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const MenuSider = (props) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.auth.login.value)

    const [currentMenu, setCurrentMenu] = useState(null)

    useEffect(() => {
        if (user) {
            const arr = user.groupWithRoles.roles?.filter(item => {
                switch (item.url) {
                    case "/user/read":
                        return item
                    case "/group/read":
                        return item
                    case "/brand/read":
                        return item
                    case "/category/read":
                        return item
                    case "/attributes/read":
                        return item
                    case "/products/read":
                        return item
                    case "/images/read":
                        return item
                    case "/orders/read":
                        return item
                }
            })
            const results = arr.map(item => {
                switch (item.url) {
                    case "/user/read":
                        return getItem(<Link to={`/user`}>User</Link>, '2', <UserOutlined />)
                    case "/group/read":
                        return getItem(<Link to={`/group`}>Group</Link>, '3', <FileImageOutlined />)
                    case "/brand/read":
                        return getItem(<Link to={"/brands"}>Brands</Link>, '6', <TagsOutlined />)
                    case "/category/read":
                        return getItem(<Link to={"/category"}>Category</Link>, '7', <ClusterOutlined />)
                    case "/attributes/read":
                        return getItem(<Link to={"/attributes"}>Attributes</Link>, '8', <CopyOutlined />)
                    case "/products/read":
                        return getItem("Products", 'sub3', <ShopOutlined />, [
                            getItem(<Link to={`/products/add`}>Add Product</Link>, '9'),
                            getItem(<Link to={`/products`}>Manage Products</Link>, '10')
                        ])
                    case "/images/read":
                        return getItem(<Link to={"/images"}>Image</Link>, '13', <FileImageOutlined />)
                    case "/orders/read":
                        return getItem("Orders", 'sub4', <DollarOutlined />, [
                            getItem(<Link to={`/orders/add`}>Add Order</Link>, '11'),
                            getItem(<Link to={`/orders`}>Manage Orders</Link>, '12')
                        ])
                }
            })
            setCurrentMenu(
                [
                    getItem(<Link to={"/"}>Dashboard</Link>, '1', <PieChartOutlined />),
                    ...results,
                    getItem(<Link to={"/profile"}>Profile</Link>, '14', <ProfileOutlined />),
                    getItem(<Link to={"/settings"}>Settings</Link>, '16', <SettingOutlined />),
                    getItem(<p onClick={() => logoutUser(navigate)}>Log out</p>, '15', <LogoutOutlined />),
                ]
            )
        }
    }, [user])

    return (
        <Menu
            theme="dark"
            mode="inline"
            items={currentMenu}
            defaultOpenKeys={props.keyPath ? [props.keyPath[1]] : null}
            selectedKeys={props.keyPath ? [props.keyPath[0]] : null}
        />
    )
}

export default MenuSider