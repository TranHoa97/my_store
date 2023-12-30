import { 
    getCategoryStart, 
    getCategorySuccess, 
    getCategoryFailed
} 
from "../category/categorySlice";
import productApi from "../../services/productApi";

export const getCategories = async(dispatch) => {
    dispatch(getCategoryStart())
    try {
        const res = await productApi.getCategories()
        if(res.st === 1) {
            dispatch(getCategorySuccess(res.data))
        } else {
            dispatch(getCategoryFailed())
        }
    } catch(err) {
        dispatch(getCategoryFailed())
        alert("Something wrong!")
    }
}



