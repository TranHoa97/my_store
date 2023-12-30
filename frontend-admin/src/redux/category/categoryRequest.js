import { 
    getCategoryStart, 
    getCategorySuccess, 
    getCategoryFailed
} 
from "../category/categorySlice";
import categoryApi from "../../services/CategoryApi";
import { openNotification } from "../slice/notificationSlice";

export const getCategoryByFilter = async(dispatch, query) => {
    dispatch(getCategoryStart())
    try {
        const res = await categoryApi.getCategoryByFilter(query)
        if(res.st === 1) {
            dispatch(getCategorySuccess(res.data))
        } else {
            dispatch(getCategoryFailed())
            dispatch(openNotification(
                {type:"error", message:res.msg, duration:2, open:true}
            ))
        }
    } catch(err) {
        dispatch(getCategoryFailed())
        dispatch(openNotification(
            {type:"error", message:"Something wrong!", duration:2, open:true}
        ))
    }
}



