import attributesApi from "../../services/AttributesApi";
import { 
    getAttributesFailed, 
    getAttributesStart, 
    getAttributesSuccess,
    getAttributesValueStart,
    getAttributesValueSuccess,
    getAttributesValueFailed
} from "../attributes/attributesSlice";
import { openNotification } from "../slice/notificationSlice";

export const getAttributesByFilter = async(dispatch, query) => {
    dispatch(getAttributesStart())
    try {
        const res = await attributesApi.getAttributesByFilter(query)
        if(res.st === 1) {
            dispatch(getAttributesSuccess(res.data))
        } else {
            dispatch(getAttributesFailed())
            dispatch(openNotification(
                { type:"error", message:res.msg, duration:2, open:true }
            ))
        }
    } catch(err) {
        dispatch(getAttributesFailed())
        dispatch(openNotification(
            { type:"error", message:"Something wrong!", duration:2, open:true }
        ))
    }
}

// Attributes Value

export const getAttributesValue = async(dispatch, attributesId) => {
    dispatch(getAttributesValueStart())
    try {
        const res = await attributesApi.getAttributesValue(attributesId)
        if(res.st === 1) {
            dispatch(getAttributesValueSuccess(res.data))
        } else {
            dispatch(getAttributesValueFailed())
            dispatch(openNotification(
                { type:"error", message:res.msg, duration:2, open:true }
            ))
        }
    } catch(err) {
        dispatch(getAttributesFailed())
        dispatch(openNotification(
            { type:"error", message:"Something wrong!", duration:2, open:true }
        ))
    }
}

