import {ScrollView, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {Button, Text, TextArea, useToast} from "native-base";
import {connect} from "react-redux";
import Loading from "../components/Loading";
import {updateElementFieldsOnServers} from "../data/server";
import {solveServerUpdateMessage} from "../data/config";

function UpdateScreen (props) {

    const [element, setElement] = useState(undefined)
    const [name, setName] = useState("")
    const [level, setLevel] = useState("")
    const [status, setStatus] = useState("")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")

    const toast = useToast()

    // incarca in element, datele transmise prin props
    useEffect (() => {
        setElement(props.route.params.element)
    }, [])

    useEffect( () => {
        if(element) {
            setName(element.name)
            setLevel(element.level)
            setStatus(element.status)
            setFrom(element.from)
            setTo(element.to)
        }
    }, [element])


    const updateElement = async() => {
        const elementNou = {
            id:element.id,
            name,
            level: Number(level),
            status,
            from: Number(from),
            to: Number(to)
        }
        console.log(elementNou)
        setElement(undefined)
        updateElementFieldsOnServers(elementNou)
            .then((res)=>{
                toast.show({
                    description: `Successfully updated fields ${solveServerUpdateMessage(res)}`,
                })

                setElement(res)
                props.navigation.goBack()
            })
            .catch((err)=>{
                console.log(err.message)
                toast.show({
                    description: err.message || err,
                })
            })
    }

    if(element)
        return (
            <ScrollView>
                <Text>Name</Text>
                <TextArea style={{backgroundColor:'white'}} value={name.toString()} onChangeText={(e)=>{setName(e)}} h={10} />

                <Text>Level</Text>
                <TextArea style={{backgroundColor:'white'}} value={level.toString()} onChangeText={(e)=>{setLevel(e)}} h={10} />

                <Text>Status</Text>
                <TextArea style={{backgroundColor:'white'}} value={status.toString()} onChangeText={(e)=>{setStatus(e)}} h={10} />

                <Text>From</Text>
                <TextArea style={{backgroundColor:'white'}} value={from.toString()} onChangeText={(e)=>{setFrom(e)}} h={10} />

                <Text>To</Text>
                <TextArea style={{backgroundColor:'white'}} value={to.toString()} onChangeText={(e)=>{setTo(e)}} h={10} />

                <Button onPress={updateElement}>Update</Button>
            </ScrollView>
        )
    return (<Loading/>)
}



export default connect()(UpdateScreen)