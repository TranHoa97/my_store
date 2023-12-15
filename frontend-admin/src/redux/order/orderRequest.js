import orderApi from "../../services/OrderApi"
import {
    getOrderFailed, 
    getOrderStart, 
    getOrderSuccess,
} from "../order/orderSlice"
import { openNotification } from "../slice/notificationSlice"

export const getOrdersByFilter = async (dispatch, query) => {
    dispatch(getOrderStart())
    const res = await orderApi.getOrdersByFilter(query)
    if(res.st === 1) {
        dispatch(getOrderSuccess(res.data))
    } else {
        dispatch(getOrderFailed())
        dispatch(openNotification(
            { type:"error", message:res.msg, duration:2, open:true }
        ))
    }
}
