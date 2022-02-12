import {Box, Pressable, ScrollView, Text, useToast, View} from 'native-base';
import {useEffect, useState} from "react";
import {getElementsFromServer, getFilteredData, updateElementOnServer} from "../data/server";
import {filterFunction, orderFunction, updateSuccessMessage} from "../data/config";
import Loading from "../components/Loading";

export default function UserScreen(){
    const [elements, setElements] = useState(undefined)
    const [levels, setLevels] = useState(undefined)

    const toast = useToast()
    useEffect(()=>{
        getElementsFromServer()
            .then((res)=>{
                res = filterFunction(res)
                setElements(res)
            })
            .catch(err => {
                toast.show({description:err})
            })
        getFilteredData()
            .then((res)=>{
                res = orderFunction(res)
                setLevels(res)
            })
            .catch(err => {
                toast.show({description:err})
            })

    },[])

    function update(elementId){
        setElements(undefined)
        updateElementOnServer(elementId)
            .then(res=>{
                toast.show({description: updateSuccessMessage})
                getElementsFromServer()
                    .then((res)=>{
                        res = filterFunction(res)
                        setElements(res)
                    })
                    .catch(err => {
                        toast.show({description:err})
                    })

            })
            .catch(err => {
                toast.show({description: err})
            })
    }

    if(!elements || !levels) return(<Loading/>)
    return(
        <ScrollView>
            <Text>      =====================</Text>
            <Text>                  Filtrare range</Text>
            <Text>      =====================</Text>
            {
                elements.map(element => {
                    return(
                        <Box key={element.id}>
                            <Pressable onLongPress={()=>{update(element.id)}}>
                                <Text>      ID: {element.id}</Text>
                                <Text>      Name: {element.name}</Text>
                                <Text>      Level: {element.level}</Text>
                                <Text>      Status: {element.status}</Text>
                                <Text>      From: {element.from}</Text>
                                <Text>      To: {element.to}</Text>
                                <Text>      -------------------------</Text>
                            </Pressable>
                        </Box>
                    )
                })
            }
            <Text>      ==========================</Text>
            <Text>                   Filtrare level</Text>
            <Text>      ==========================</Text>
            {
                levels.map(element => {
                    return(
                        <Box key={element.id}>
                            <Text>      ID: {element.id}</Text>
                            <Text>      Name: {element.name}</Text>
                            <Text>      Level: {element.level}</Text>
                            <Text>      Status: {element.status}</Text>
                            <Text>      From: {element.from}</Text>
                            <Text>      To: {element.to}</Text>
                            <Text>      -------------------------</Text>
                        </Box>
                    )
                })
            }
        </ScrollView>
        )
}

