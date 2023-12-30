import productApi from "../../services/ProductApi"
import {
    getProductFailed, 
    getProductStart, 
    getProductSuccess,
} from "../product/productSlice"
import { openNotification } from "../slice/notificationSlice"

export const getProductsByFilter = async (dispatch, query) => {
    dispatch(getProductStart())
    try {
        const res = await productApi.getProductsByFilter(query)
        if(res.st === 1) {
            dispatch(getProductSuccess(res.data))
        } else {
            dispatch(getProductFailed())
            dispatch(openNotification(
                { type:"error", message:res.msg, duration:2, open:true }
            ))
        }
    } catch(err) {
        dispatch(getProductFailed())
        dispatch(openNotification(
            { type:"error", message:"Something wrong!", duration:2, open:true }
        ))
    }
}

