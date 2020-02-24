//initialState是State的預設值，(initialHistoryState.js)
import initialState from './initialState';

// 回傳 Counter mapStoreToProps 函式裡面的 state 值
function reducer(state = initialState, action) {
    //根據action type更新state
    switch (action.type) {
        case 'QUERYTAGSCOUNTRY':
            return {
                ...state,
                queryTags:{
                    ...state.queryTags,
                    country: action.value
                }
            }
        case 'QUERYTAGSFESTIVALVALUE':
            return {
                ...state,
                queryTags:{
                    ...state.queryTags,
                    value: action.value
                }
            }
        case 'QUERYTAGSFESTIVALTEXT':
            return {
                ...state,
                queryTags:{
                    ...state.queryTags,
                    text: action.value
                }
            }
        case 'ERPSEARCHLISTDATE':
            return {
                ...state,
                searchList:{
                    ...state.searchList,
                    startDate: action.startDate,
                    endDate: action.endDate
                }
            }
        default:
            return state;
    }
}

export default reducer;