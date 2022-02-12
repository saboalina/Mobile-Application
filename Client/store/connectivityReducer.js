

export default function (state= false, action){
    switch(action.type){
        case 'SET_ONLINE':
            return true;
        case 'SET_OFFLINE':
            return false;
        default:
            return state;
    }
}