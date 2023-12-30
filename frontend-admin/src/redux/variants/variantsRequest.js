import variantsApi from "../../services/VariantsApi"
import { 
    getVariantsStart, 
    getVariantsSuccess, 
    getVariantsFailed 
} from "./variantsSlice"
import { openNotification } from "../slice/notificationSlice"

export const getVariantByFilter = async (dispatch, query) => {
    dispatch(getVariantsStart())
    try {
        const res = await variantsApi.getVariantByFilter(query)
        if(res.st === 1) {
            dispatch(getVariantsSuccess(res.data))
        } else {
            dispatch(getVariantsFailed())
            dispatch(openNotification(
                { type:"error", message:res.msg, duration:3, open:true }
            ))
        }
    } catch(err) {
        dispatch(getVariantsFailed())
        dispatch(openNotification(
            { type:"error", message:"Something wrong!", duration:3, open:true }
        ))
    }
}



