import Ajax from './ajax'
import { baseUrl } from '../util/global'
// localStorage.setItem("token",'7841f3f33fdf4785a4c7f7e6b05d27ee')
// 创建用户信息接口实例
const eucApi = new Ajax({
    baseUrl: baseUrl,
    reqSuccessKey: 'status', 
    reqSuccessValue: [100,202,301], //100成功 202登录超时 301 分店不全
    msgKey: 'msg',
    interceptError: null
})


export default eucApi


// ============single 房态信息
export const loogStatus = (params) => eucApi.get('/roomStatus/getFarDateRoomStatus/v1',{...params})

export const timeStatus = (params) => eucApi.get('roomStatus/getRTRoomStatus/v2',{...params})

// ============ 同城房态
export const getHotelList = (params) => eucApi.post(`/urbanRoomStatus/queryUrbanHotels/v1?tk=${localStorage.getItem("token")}`,{...params})
export const getRoomStatusList = (params) => eucApi.get('/urbanRoomStatus/queryUrbanRoomsStatusByStoreIds/v1',{...params})

// =======调价记录
export const getRoomRateCode = (params) => eucApi.get(`/roomRate/v1/rateCodes`,{...params})
export const getChangePriceList = (params) => eucApi.post(`/roomRate/v1/search?tk=${localStorage.getItem("token")}`,{...params})



