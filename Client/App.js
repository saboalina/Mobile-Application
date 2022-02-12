import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ManagerScreen from "./screens/ManagerScreen";
import UserScreen from "./screens/UserScreen";
import StatsScreen from "./screens/StatsScreen";
import HomeScreen from "./screens/HomeScreen";
import {extendTheme} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import {useEffect, useState} from "react";
import {applyMiddleware, createStore} from "redux";
import {rootReducer} from "./store";
import thunk from "redux-thunk";
import {connect, Provider} from "react-redux";
import {
    createCRUDTableInDataBase,
    createTableInDataBase, deleteCRUDFromDatabase,
    readAllCRUDFromDataBase,
    readAllFromDataBase
} from "./data/sqlDatabase";
import {server_port, server_url} from "./data/config";
import AddScreen from "./screens/AddScreen";
import Loading from "./components/Loading";
import {addElementToServer, deleteElementOnServer} from "./data/server";
import DetaliiScreen from "./screens/DetaliiScreen";
import UpdateScreen from "./screens/UpdateScreen";

const Stack = createNativeStackNavigator();

 export default function App() {

    const [store, setStore] = useState(undefined)
    const [ws, setWs] = useState(undefined)

    const pingServer = () => {
        const ws = new WebSocket(`ws://${server_url}:${server_port}`);
        ws.onopen = ()=>{
            restoreCRUDfromDB() // se fac modificarile care s-au efectuat cat timp serverul a fost oprit
            store.dispatch({
                type: 'SET_ONLINE'
            })
            console.log("Ping success")
        }
        ws.onclose = () => {
            console.log('conexiune inchisa')
            store.dispatch({
                type:'SET_OFFLINE'
            })
            pingServer()
        }
        ws.onerror = (err)=>{
            console.log('Ping failed', err.message)
        }
        setWs(ws)
    }

    function restoreCRUDfromDB(){
        createCRUDTableInDataBase() // creaza tabela daca nu exista
            .then(()=>{
                readAllCRUDFromDataBase()  // citeste toate datele din tabela
                    .then(async(CRUDelements) => {
                        for(let i = 0; i< CRUDelements.length; i++){
                            let response
                            switch(CRUDelements[i].operationType){
                                case 'add':                               // adauga elementele in server
                                    const newElement = CRUDelements[i]
                                    delete newElement["operationType"]
                                    delete newElement["crudId"]
                                    response = await addElementToServer(newElement)
                                    break

                                case 'delete':
                                     response = await deleteElementOnServer(CRUDelements[i].id) // sterge un element din server
                                    break
                                default:
                                    response.status = 404
                            }
                            if(response.status === 200 || response.status === 404){
                                deleteCRUDFromDatabase(CRUDelements[i].crudId) // sterge elementul din tabela de CRUDS, o data ce el a fost adaugat la server sau sters de pe server
                                    .then((res)=>{
                                        console.log("")
                                    })
                                    .catch((err)=>{
                                        console.log('Error: ', err)
                                    })
                            }
                        }
                    })
            })
            .catch(()=>{
                console.log('ii vai si amar')
            })
    }

    function restoreFromDB(){

        createTableInDataBase()     // creaza tabela daca nu exista
            .then((res)=>{
                readAllFromDataBase() // citeste datele din baza de date
                    // s-au citit datele din tabela
                    .then((elements)=>{
                        const preloadedState = {elements: elements, connectivity: false}            // se incarca elementele in store-ul aplicatiei
                        setStore(createStore(rootReducer, preloadedState, applyMiddleware(thunk)))
                    })
                    // nu s-au putut citi datele din tabela = tabela nu exista?
                    .catch(async()=>{
                        await createTableInDataBase()
                        setStore(createStore(rootReducer, applyMiddleware(thunk)))                  // se creaza un store gol
                    })
            })
            .catch((err)=>{
                console.log('Cannot create database table', err)
                setStore(createStore(rootReducer, applyMiddleware(thunk)))
            })
        }

        // cand se reincarca store-ul se verifica conexiunea la server
    useEffect(()=>{
        if(store)
            pingServer()
    },[store])

     // cand se deschide aplicatia se creaza si populeaza tabelul din baza de date
    useEffect(()=>{
        restoreFromDB()
    },[])


    const theme = extendTheme({
    components: {
      Text: {
        baseStyle: {},
        defaultProps: {size:'md'},
        variants: {},
        sizes: {
          md: { fontSize: '18px' },
        },
      }
    }
    });

    if(store){
      return (
          <Provider store={store}>
              <NativeBaseProvider theme={theme}>
                  <NavigationContainer >
                      <Stack.Navigator>
                          <Stack.Screen name="Home">{(props) => <HomeScreen {...props} ws={ws} />}</Stack.Screen>
                          <Stack.Screen name="Manager" component={ManagerScreen} />
                          <Stack.Screen name="Detalii" component={DetaliiScreen} />
                          <Stack.Screen name="Update" component={UpdateScreen} />
                          <Stack.Screen name="Add" component={AddScreen} />
                          <Stack.Screen name="User" component={UserScreen} />
                          <Stack.Screen name="Stats" component={StatsScreen} />
                      </Stack.Navigator>
                  </NavigationContainer>
              </NativeBaseProvider>
          </Provider>

      );
    }
    return(<NativeBaseProvider theme={theme}><Loading></Loading></NativeBaseProvider>)

}




