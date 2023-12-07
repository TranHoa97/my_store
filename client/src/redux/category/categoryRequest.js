import { 
    getCategoryStart, 
    getCategorySuccess, 
    getCategoryFailed
} 
from "../category/categorySlice";
import productApi from "../../services/productApi";

import smartphoneImage from "../../assets/image-category/ic-dienthoai-desktop.webp"
import tabletImage from "../../assets/image-category/icon-mtb-desk.webp"
import laptopImage from "../../assets/image-category/icon-laptop.webp"
import accessoriesImage from "../../assets/image-category/icon-accessories.webp"

import smartphoneIcon from '../../assets/icon-nav/smartphone_100x.png'
import tabletIcon from '../../assets/icon-nav/tablet_100x.png'
import laptopIcon from '../../assets/icon-nav/laptop_100x.png'
import headphonesIcon from '../../assets/icon-nav/headphones_100x.png'

export const getCategories = async(dispatch) => {
    dispatch(getCategoryStart())
    const res = await productApi.getCategories()
    if(res.st === 1) {
        const results = res.data.map(item => {
            if(item.slug === "dien-thoai") {
                return {...item, image:smartphoneImage, icon:smartphoneIcon}
            }
            if(item.slug === "may-tinh-xach-tay") {
                return {...item, image:laptopImage, icon:laptopIcon}
            }
            if(item.slug === "may-tinh-bang") {
                return {...item, image:tabletImage, icon:tabletIcon}
            }
            if(item.slug === "linh-phu-kien") {
                return {...item, image:accessoriesImage, icon:headphonesIcon}
            }
        })
        dispatch(getCategorySuccess(results))
    } else {
        dispatch(getCategoryFailed())
    }
}



