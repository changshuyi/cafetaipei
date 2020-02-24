import dayjs from 'dayjs';
// 預設 state 
const initialState = {

    showFeatureLabel:true,
    searchResult:[],
    isLoaded:false,//讀取中狀態
    isLanded:false,//首次載入

    queryTags:{ //測試用
        country: 0,
        value: 'usa',
        text: '美洲'
    },

    searchList:{
        startDate: dayjs().format("YYYYMMDD"),
        endDate: dayjs().add(1, 'month').format("YYYYMMDD")
    },
}
export default initialState;