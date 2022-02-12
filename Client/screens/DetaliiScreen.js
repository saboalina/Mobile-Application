import {Text, View} from "react-native";
import React, {useEffect, useState} from 'react'
import {Button, useToast} from "native-base";
import Loading from "../components/Loading";
import {findElement} from "../data/server";
import {useRoute} from "@react-navigation/native";

export default function DetaliiScreen (props) {

    const [element, setElement] = useState({})
    const toast = useToast()
    const route = useRoute()

    // la incarcarea screen-ului se face update, pentru a ne asigura ca in urma unui update atributele elementului vor fi actualizate
    useEffect(()=>{
        update()
        props.navigation.addListener('focus',() => {
            console.log('screen change')
            update()
        })
    },[])

    if (props.route.params.elementId === undefined) {
        return <Text> Nu a fost pasat un element </Text>
    }

    useEffect (() => {
        update()
        props.navigation.addListener('blur',()=>{
            update()
        });

    }, [])

    // Functie care incarca in element, field-urile corespunzatoare elementului pe care s-a dat click, respectiv elementului primit de la server
    function update(){
        findElement(props.route.params.elementId)
            .then((res)=>{
                setElement(res)
            })
            .catch((err)=>{
                toast.show({description: err})
            })
    }


    if (element)
        return (
            <View>
                <Text>      Name: {element.name}</Text>
                <Text>      Level: {element.level}</Text>
                <Text>      Status: {element.status}</Text>
                <Text>      From: {element.from}</Text>
                <Text>      To: {element.to}</Text>

                <Button size="lg" onPress={() => {props.navigation.navigate('Update', {element: element})}}>
                    Update
                </Button>
            </View>
        )
    return (<Loading/>)
}

