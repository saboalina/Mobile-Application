
import {Button, useToast, View} from 'native-base';
import {solveServerUpdateMessage} from "../data/config";
import {useEffect} from "react";
import {connect} from "react-redux";


function HomeScreen({ws,navigation, connectivity}){
    const toast = useToast()


    useEffect(() => {
        if(ws)
            ws.onmessage = (message) => {
                console.log(message)
                toast.show({
                    description: solveServerUpdateMessage(JSON.parse(message.data))
                })
            }
    }, [ws])

    return (
        <View>
            <Button onPress={() => navigation.navigate('Manager')}>Staff</Button>
            <Button isDisabled={!connectivity} onPress={() => navigation.navigate('User')}>Employee</Button>
            {/*<Button isDisabled={!connectivity} onPress={() => navigation.navigate('Stats')}>Stats</Button>*/}
        </View>
    )
}

function mapStateToProps (store) {
    return{
        connectivity: store.connectivity
    }
}
export default connect(mapStateToProps)(HomeScreen)