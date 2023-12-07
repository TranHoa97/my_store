import React, { useEffect } from "react"
import AppRoute from "./routes/AppRoute"
import "./App.css"
import { notification } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { closeNotification } from "./redux/slice/notificationSlice";

function App() {
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch()

  const blingbling = useSelector(state => state.notification)

  const openNotification = (type, message, duration) => {
    api.open({
      type: type,
      description: message,
      duration: duration,
    });
  }

  useEffect(() => {
    if(blingbling.open) {
      openNotification(blingbling.type, blingbling.message, blingbling.duration)
      dispatch(closeNotification())
    }
  }, [blingbling.open])
  return (
    <>
      {contextHolder}
      <AppRoute />
    </>
  )
}

export default App
