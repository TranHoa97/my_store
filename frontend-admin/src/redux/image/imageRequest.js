import imageApi from "../../services/ImageApi"
import {
    getImageStart,
    getImageSuccess,
    getImageFailed
} from "../image/imageSlice"
import { openNotification } from "../slice/notificationSlice"

export const getImagesByFilter = async (dispatch, query) => {
    dispatch(getImageStart())
    try {
        const res = await imageApi.getImagesByFilter(query)
        if(res.st === 1) {
            dispatch(getImageSuccess(res.data))
        } else {
            dispatch(getImageFailed())
            dispatch(openNotification(
                { type:"error", message:res.msg, duration:2, open:true }
            ))
        }
    } catch(err) {
        dispatch(getImageFailed())
        dispatch(openNotification(
            { type:"error", message:"Something wrong!", duration:2, open:true }
        ))
    }
}

