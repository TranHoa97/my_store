import { 
    getCategoryStart, 
    getCategorySuccess, 
    getCategoryFailed
} 
from "../category/categorySlice";
import categoryApi from "../../services/CategoryApi";
import { openNotification } from "../slice/notificationSlice";

export const getAllCategories = async(dispatch) => {
    dispatch(getCategoryStart())
    const res = await categoryApi.getAllCategories()
    if(res.st === 1) {
        dispatch(getCategorySuccess(res.data))
    } else {
        dispatch(getCategoryFailed())
        dispatch(openNotification(
            {type:"error", message:res.msg, duration:2, open:true}
        ))
    }
}



