import roleApi from "../../services/RoleApi";
import { openNotification } from "../slice/notificationSlice";
import {
    getRoleStart,
    getRoleSuccess,
    getRoleFailed,
} from "./roleSlice";

export const getAllRoles = async (dispatch) => {
    dispatch(getRoleStart())
    const res = await roleApi.getAllRoles()
    if(res.st === 1) {
        dispatch(getRoleSuccess(res.data))
    } else {
        dispatch(getRoleFailed())
        dispatch(openNotification(
            {type:"error", message:res.msg, duration:2, open:true}
        ))
    }
}
