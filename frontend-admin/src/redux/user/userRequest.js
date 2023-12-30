import userApi from "../../services/UserApi";
import { openNotification } from "../slice/notificationSlice";
import {
    getUserFailed,
    getUserStart,
    getUserSuccess
} from "./userSlice";

export const getUsersByFilter = async (dispatch, query) => {
    dispatch(getUserStart())
    try {
        const res = await userApi.getUserByFilter(query)
        if(res.st === 1) {
            dispatch(getUserSuccess(res.data))
        } else {
            dispatch(getUserFailed())
            dispatch(openNotification(
                { type:"error", message:res.msg, duration:2, open:true }
            ))
        }
    } catch(err) {
        dispatch(getUserFailed())
        dispatch(openNotification(
            { type:"error", message:"Something wrong!", duration:2, open:true }
        ))
    }
}

