import { 
    loginStart, 
    loginSuccess, 
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed 
} from "./authSlice"
import authApi from "../../services/AuthApi"
import { setMenu } from "../slice/menuSiderSlice"
import { openNotification } from "../slice/notificationSlice"

export const loginUser = async(dispatch, navigate, user) => {
    dispatch(loginStart())
    try{
        const res = await authApi.loginUser(user)
        if(res.st === 1) {
            dispatch(loginSuccess(res.data))
            dispatch(setMenu(["1"]))
            navigate("/")
        } else {
            dispatch(loginFailed())
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
        }
    }catch(err){
        dispatch(loginFailed())
        dispatch(openNotification(
            { type: "error", message: "Something wrong!", duration: 2, open: true }
        ))
    }
}

export const registerUser = async(dispatch, navigate, user) => {
    dispatch(registerStart())
    try {
        const res = await authApi.registerUser(user)
        if(res.st === 1) {
            dispatch(registerSuccess())
            dispatch(openNotification(
                { type: "success", message: res.msg, duration: 2, open: true }
            ))
            navigate("/login")
        } else {
            dispatch(registerFailed())
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
        }
    } catch(err) {
        dispatch(registerFailed())
        dispatch(openNotification(
            { type: "error", message: "Something wrong!", duration: 2, open: true }
        ))
    }
}

export const logoutUser = async(navigate) => {
    try {
        const res = await authApi.logoutUser()
        if(res.st === 1) {
            localStorage.clear()
            navigate("/login")
        } else {
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
        }
    } catch(err) {
        dispatch(openNotification(
            { type: "error", message: "Something wrong!", duration: 2, open: true }
        ))
    }
}

export const getAccount = async(dispatch, id) => {
    dispatch(loginStart())
    try{
        const res = await authApi.getAccount(id)
        if(res.st === 1) {
            dispatch(loginSuccess(res.data))
        } else {
            dispatch(loginFailed())
            dispatch(openNotification(
                { type: "error", message: res.msg, duration: 2, open: true }
            ))
        }
    }catch(err){
        dispatch(loginFailed())
        dispatch(openNotification(
            { type: "error", message: "Something wrong!", duration: 2, open: true }
        ))
    }
}