import roleApi from "../../services/RoleApi";
import { openNotification } from "../slice/notificationSlice";
import {
    getRoleStart,
    getRoleSuccess,
    getRoleFailed,
} from "./roleSlice";

export const getAllRoles = async (dispatch) => {
    dispatch(getRoleStart())
    try {
        const res = await roleApi.getAllRoles()
        if(res.st === 1) {
            dispatch(getRoleSuccess(res.data))
        } else {
            dispatch(getRoleFailed())
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 3, open: true }
            ))
        }
    } catch(err) {
        dispatch(getRoleFailed())
        dispatch(openNotification(
            { type: "error", message: "Something wrong!", duration: 2, open: true }
        ))
    }
}
