import { 
    getBrandStart, 
    getBrandSuccess, 
    getBrandFailed,
} from "../brand/brandSlice";
import brandApi from "../../services/BrandApi";
import { openNotification } from "../slice/notificationSlice";

export const getBrandsByFilter = async(dispatch, query) => {
    dispatch(getBrandStart())
    try {
        const res = await brandApi.getBrandsByFilter(query)
        if(res.st === 1) {
            dispatch(getBrandSuccess(res.data))
        } else {
            dispatch(getBrandFailed())
            dispatch(openNotification(
                {type:"error", message:res.msg, duration:2, open:true}
            ))
        }
    } catch(err) {
        dispatch(getBrandFailed())
        dispatch(openNotification(
            {type:"error", message:"Something wrong!", duration:2, open:true}
        ))
    }
}

