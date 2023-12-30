import { openNotification } from "../slice/notificationSlice";
import groupApi from "../../services/GroupApi";
import {
    getGroupStart,
    getGroupSuccess,
    getGroupFailed,
} from "./groupSlice";

export const getGroupByFilter = async (dispatch, query) => {
    dispatch(getGroupStart())
    try {
        const res = await groupApi.getGroupByFilter(query)
        if (res.st === 1) {
            dispatch(getGroupSuccess(res.data))
        } else {
            dispatch(getGroupFailed())
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 3, open: true }
            ))
        }
    } catch (err) {
        dispatch(getGroupFailed())
        dispatch(openNotification(
            { type: "error", message: "Something wrong!", duration: 3, open: true }
        ))
    }
}


