

export default function (state=[], action){
    switch(action.type){
        case 'ADD':
            return state.concat([action.payload])
        case 'DELETE':
            return state.filter((element) => action.payload !== element.id)
        case 'UPDATE':
            return state.map(
                (element) => {
                    if(element.id === action.payload){
                        return{...element,...action.payload}
                    }
                    return element
                })
        case 'UPDATE_ALL':
            return [...action.payload]
        default:
            return state
 }
}