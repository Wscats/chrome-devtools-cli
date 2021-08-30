import { createStore } from 'redux';
const counter = (
    state = {
        rangeSelections: [],
        skill: ['ps', 'ts']
    },
    action
) => {
    switch (action.type) {
        case 'SET_RANGE_SELECTIONS':
            return {
                ...state,
                rangeSelections: action.rangeSelections
            };
        case 'SET_FD_AND_ROUTE_ID':
            return {
                ...state,
                fd: action.fd,
                routeId: action.routeId
            };
        default:
            return state;
    }
};
let store = createStore(counter);
export default store;
