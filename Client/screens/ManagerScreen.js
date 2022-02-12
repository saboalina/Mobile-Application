import {Box, Button, Fab, Icon, Pressable, ScrollView, Text, useToast, View} from 'native-base';
import {connect} from "react-redux";
import ValidationAlert from "../components/Alert";
import {useEffect, useState} from "react";
import {DeleteElement, getAllFromServer} from "../store/action";
import {AntDesign} from "@expo/vector-icons";
import Loading from "../components/Loading";
import DeleteModal from "../components/DeleteModal";
import {useHeaderHeight} from '@react-navigation/elements';
import {Dimensions, StyleSheet} from "react-native";


function ManagerScreen({elements, connectivity, refreshList, navigation, deleteElement}){

    const [showAlert, setShowAlert] = useState(false)
    const [progressIndicator, setProgressIndicator] = useState(true)
    const toast = useToast()
    // for DELETE only
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [idToDelete, setIdToDelete] = useState(undefined)


    const windowHeight = Dimensions.get('window').height;
    const headerHeight = useHeaderHeight();

    const style = StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            overflow: "scroll",
            height: windowHeight - headerHeight
        }
    })

    // cand se incarac screen-ul -> la pornirea aplicatiei sau la refresh
    useEffect(()=>{
        refreshList() //ia toate elementele de la server, le adauga in baza de date si seteaza conectivitatea ca fiind ONLINE
            .then(()=>{
                setProgressIndicator(false)
                setShowAlert(false)
            })
            .catch(()=>{
                setProgressIndicator(false)
                setShowAlert(true)
            })
        // ca sa se vada modificarile facute dupa UPDATE
        navigation.addListener('focus',()=>{
            setProgressIndicator(true)
            refreshList()
                .then(()=>{
                    setProgressIndicator(false)
                    setShowAlert(false)
                })
                .catch(()=>{
                    setProgressIndicator(false)
                    setShowAlert(true)
                })
        })
    },[])

    // Alertul apare doar cand connectivity este false
    useEffect(()=>{
        if(!connectivity)
            setShowAlert(!connectivity)
    },[connectivity])

    if(!progressIndicator){
        return(
            <View style={style.container}>
                <ValidationAlert
                    setShow={setShowAlert}
                    show={showAlert}
                    message={{
                        primary:"Nu s-a putut face conexiunea la server",
                        secondary:
                            <Button
                                onPress={()=>{
                                    refreshList()
                                        .then(()=>{
                                            setProgressIndicator(false)
                                            setShowAlert(false)
                                        })
                                        .catch(()=>{
                                            setProgressIndicator(false)
                                            setShowAlert(true)
                                        })
                                }}>
                                Retry connection
                            </Button>
                    }}
                >
                </ValidationAlert>
                <ScrollView>
                    {elements.map((element) => (
                        <Box key={element.id + element.name}>
                            {/* La o apasare se face DELETE de element */}
                            <Pressable
                                onPress={() => {
                                    setIdToDelete(element.id)
                                    setShowConfirmModal(true)
                                }}
                               onLongPress={() => {
                                   if(connectivity)
                                       navigation.navigate('Detalii', {elementId: element.id})
                               }}>

                                <Text>      ID: {element.id}</Text>
                                <Text>      Name: {element.name}</Text>
                                <Text>      Level: {element.level}</Text>
                                <Text>      Status: {element.status}</Text>
                                <Text>      From: {element.from}</Text>
                                <Text>      To: {element.to}</Text>
                                <Text>      -------------------------</Text>
                            </Pressable>
                        </Box>))}
                </ScrollView>
                <Fab
                    placement="bottom-right"
                    size="sm"
                    renderInPortal={false}
                    onPress={() => navigation.navigate('Add')}
                    icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
                />
                {/* Doar pentru DELETE*/}
                <DeleteModal showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} deleteElementModal={()=>{
                    setProgressIndicator(true)
                    deleteElement(idToDelete)
                        .then((res)=>{
                            setShowConfirmModal(false)
                            toast.show({
                                description: res
                            })
                            setProgressIndicator(false)
                        })
                        .catch((err)=>{
                            setShowConfirmModal(false)
                            setProgressIndicator(false)
                        })
                }}/>
            </View>
        )
    }
    return (<Loading/>)
}

function mapStateToProps (store) {
    return {
        elements: store.elements,
        connectivity: store.connectivity
    }
}

function mapDispatchToProps (dispatch) {
    return {
        refreshList: getAllFromServer(dispatch), //ia toate elementele de la server, le adauga in baza de date si seteaza conectivitatea ca fiind ONLINE
        deleteElement: DeleteElement(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagerScreen)