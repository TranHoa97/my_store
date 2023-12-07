import userApi from "../../services/UserApi";
import { openNotification } from "../slice/notificationSlice";
import {
    getUserFailed,
    getUserStart,
    getUserSuccess
} from "./userSlice";

export const getAllUsers = async (dispatch) => {
    dispatch(getUserStart())
    const res = await userApi.getAllUsers()
    if(res.st === 1) {
        dispatch(getUserSuccess(res.data))
    } else {
        dispatch(getUserFailed())
        dispatch(openNotification(
            { type:"error", message:res.msg, duration:2, open:true }
        ))
    }
}

export const getUsersByGroup = async (dispatch, groupId) => {
    dispatch(getUserStart())
    const res = await userApi.getUserByGroup(groupId)
    if(res.st === 1) {
        dispatch(getUserSuccess(res.data))
    } else {
        dispatch(getUserFailed())
        dispatch(openNotification(
            { type:"error", message:res.msg, duration:2, open:true }
        ))
    }
}

export const getUsersByFilter = async (dispatch, query) => {
    dispatch(getUserStart())
    const res = await userApi.getUserByFilter(query)
    if(res.st === 1) {
        dispatch(getUserSuccess(res.data))
    } else {
        dispatch(getUserFailed())
        dispatch(openNotification(
            { type:"error", message:res.msg, duration:2, open:true }
        ))
    }
}

