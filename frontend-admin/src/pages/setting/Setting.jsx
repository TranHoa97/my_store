import React, { useEffect } from 'react'
import { Space, Row, Typography } from 'antd'

import { setMenu } from '../../redux/slice/menuSiderSlice'

const Setting = () => {

  useEffect(() => {
    dispatch(setMenu(["16"]))
  }, [])

  return (
    <Space direction={"vertical"} size={"middle"} style={{ width: "100%" }}>
      <Row>
        <Typography.Title level={3}>Settings</Typography.Title>
      </Row>
    </Space>
  )
}

export default Setting