import {Box, Pressable, ScrollView, Text, useToast, View} from 'native-base';
import Loading from "../components/Loading";
import {useEffect, useState} from "react";
import {getElementsFromServer} from "../data/server";

export default function StatsScreen(){
    const [elements, setElements] = useState(undefined)
    const toast = useToast()
    useEffect(()=>{
        getElementsFromServer()
            .then(res => {
                res.sort((a,b) => {
                    return (Number(a.count) < Number(b.count)) ? 1 : (Number(a.count) > (Number(b.count)) ? -1 : 0)
                })
                setElements(res.slice(0,15))
            })
            .catch((err) => {
                toast.show({description: err})
            })
    },[])


    if(!elements) return(<Loading/>)
    return (
        <ScrollView>
            {
                elements.map(element => {
                    return(
                        <Box key={element.id}>
                            <Text>      ID: {element.id}</Text>
                            <Text>      Name: {element.name}</Text>
                            <Text>      Level: {element.level}</Text>
                            <Text>      Status: {element.status}</Text>
                            <Text>      From: {element.fromm}</Text>
                            <Text>      To: {element.too}</Text>
                            <Text>      -------------------------</Text>
                        </Box>
                    )
                })
            }
        </ScrollView>
    )
}