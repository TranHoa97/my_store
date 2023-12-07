import { openNotification } from "../slice/notificationSlice";
import groupApi from "../../services/GroupApi";
import {
    getGroupStart, 
    getGroupSuccess,
    getGroupFailed, 
} from "./groupSlice";

export const getAllGroups = async (dispatch) => {
    dispatch(getGroupStart())
    const res = await groupApi.getAllGroups()
    if(res.st === 1) {
        dispatch(getGroupSuccess(res.data))
    } else {
        dispatch(getGroupFailed())
        dispatch(openNotification(
            { type:"error", message:res.msg, duration:2, open:true }
        ))
    }
}


