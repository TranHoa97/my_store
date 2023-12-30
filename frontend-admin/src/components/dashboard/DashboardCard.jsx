import React from 'react'
import { Space, Card, Statistic } from 'antd'

const DashboardCard = (props) => {
  return (
    <Card>
        <Space direction='horizontal' size={"large"}>
            {props.icon}
            <Statistic title={props.title} value={props.value} />
        </Space>
    </Card>
  )
}

export default DashboardCard