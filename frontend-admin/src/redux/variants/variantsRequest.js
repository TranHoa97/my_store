import variantsApi from "../../services/VariantsApi"
import { 
    getVariantsStart, 
    getVariantsSuccess, 
    getVariantsFailed 
} from "./variantsSlice"
import { openNotification } from "../slice/notificationSlice"

export const getAllVariants = async (dispatch) => {
    dispatch(getVariantsStart())
    const res = await variantsApi.getAllVariants()
    if(res.st === 1) {
        dispatch(getVariantsSuccess(res.data))
    } else {
        dispatch(getVariantsFailed())
        dispatch(openNotification(
            { type:"error", message:res.msg, duration:2, open:true }
        ))
    }
}

export const getVariantsByProduct = async (dispatch, productId) => {
    dispatch(getVariantsStart())
    const res = await variantsApi.getVariants(productId)
    if(res.st === 1) {
        dispatch(getVariantsSuccess(res.data))
    } else {
        dispatch(getVariantsFailed())
        dispatch(openNotification(
            { type:"error", message:res.msg, duration:2, open:true }
        ))
    }
}



