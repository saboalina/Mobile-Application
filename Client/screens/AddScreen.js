import View from "react-native-web/dist/vendor/react-native/Animated/components/AnimatedView";
import {Button, ScrollView, Text, TextArea, TextField, useToast} from "native-base";
import {Dimensions, StyleSheet} from "react-native";

import {useState} from "react";
import {connect} from "react-redux";
import {AddElement} from "../store/action";
import Loading from "../components/Loading";


function AddScreen(props){
    const [name, setName] = useState("")
    const [level, setLevel] = useState("")
    const [status, setStatus] = useState("")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const adaugaElement = async () =>{
        const elementNou = {
            name,
            level: Number(level),
            status,
            from: Number(from),
            to: Number(to),
        }
        setLoading(true)
        props.addElement(elementNou)
            .then((result)=> {
                setLoading(false)
                toast.show({
                    description: result,
                })
                setTimeout(()=> {
                    props.navigation.goBack()
                }, 1000)
            })
            .catch(error => {
                setLoading(false)
                toast.show({
                    description: error,
                })
            })
    }
    if(!loading)
    return(
        <ScrollView style={styles.addScreen}>
            <Text>Name</Text>
            <TextArea value={name} onChangeText={(e)=>{setName(e)}} h={10} />
            <Text>Level</Text>
            <TextArea value={level} onChangeText={(e)=>{setLevel(e)}} h={10} />
            <Text>Status</Text>
            <TextArea value={status} onChangeText={(e)=>{setStatus(e)}} h={10} />
            <Text>From</Text>
            <TextArea value={from} onChangeText={(e)=>{setFrom(e)}} h={10} />
            <Text>To</Text>
            <TextArea value={to} onChangeText={(e)=>{setTo(e)}} h={10} />
            <Button onPress={adaugaElement}>Add</Button>
        </ScrollView>
    )
    return <Loading/>
}

const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    addScreen: {
        height: windowHeight/2,
        overflow: "scroll",
        paddingBottom: 20,
    }
})

const mapStateToProps = (state) => {
    return {elements: state.elements}
}
const mapDispatchToProps = (dispatch) => {
    return {addElement:AddElement(dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddScreen)