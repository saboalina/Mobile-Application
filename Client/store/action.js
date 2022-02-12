import {addElementToServer, deleteElementOnServer, getElementsFromServer} from "../data/server";
import {
    addToCRUDDatabase,
    addToDatabase,
    createTableInDataBase,
    deleteFromDatabase,
    dropTable
} from "../data/sqlDatabase";

// Functie care ia toate elementele de la server, le adauga in baza de date si seteaza conectivitatea ca fiind ONLINE
export function getAllFromServer(dispatch){
   return (()=>{
       return new Promise((resolve, reject) => {
           getElementsFromServer()     // functie care ia toate elementele de la server
               .then(async (elements) => {

                   await dropTable()
                   await createTableInDataBase()

                   elements.forEach((element) => {
                       addToDatabase(element)            // se adauga fiecare element in baza de date locala
                   })

                   // TO DO: add elements to store and set connection true
                   console.log('Successful retrieve from server')

                   dispatch({
                       type: 'UPDATE_ALL',
                       payload: elements
                   })

                   dispatch({
                       type: 'SET_ONLINE'
                   })
                   resolve()
               })
               .catch(()=>{
                   console.log('Cannot retrieve data from server, check config file -> getAllElementsPath')
                   reject()
               })
       })

   })
}

export function AddElement(dispatch){

    return (element) => {
        return new Promise((resolve, reject) => {
            console.log('element', element)
            addElementToServer(element)                                         //se adauga elementul pe server
                .then(receivedElement => {
                    console.log('Element trimis cu succes la server')
                    console.log('return element', receivedElement)
                    addToDatabase(receivedElement)                              //se adauga elementul in baza de date
                        .then(res => {
                            console.log('Element adaugat cu succes in database')
                            dispatch({
                                type:'ADD',
                                payload: receivedElement
                            })
                            resolve("Elementul a fost adaugat cu succes")
                        })
                        .catch(err => {
                            console.log('failed to add element in the database')
                            reject(err)
                        })
                })
                .catch(err => {                                                 //daca nu se poate adauga elementul pe server
                    console.log('failed to add to server')
                    addToCRUDDatabase(element, 'add')
                       .then(res => {
                           console.log(res)
                           element.id = res.insertId
                          addToDatabase(element)        // adauga operatia in baza de date CRUD
                              .then((res)=>{
                                  console.log('Element adaugat cu succes in database offline')
                                  dispatch({
                                      type:'ADD',
                                      payload: element
                                  })
                                  resolve("Elementul a fost adaugat cu succes offline")
                              })
                              .catch((err)=>{
                                  console.log('Elementul nu a fost adaugat in database offline')
                                  dispatch({
                                      type:'ADD',
                                      payload: element
                                  })
                                  resolve("Elementul nu a fost adaugat offline")
                              })
                       })
                        .catch(err => {
                            console.log('failed to add element in the database offline')
                        })
                })
        })

    }
}

export function DeleteElement(dispatch){
    return (elementId) => {
        return new Promise((resolve, reject)=>{
            deleteElementOnServer(elementId)                                    // sterge elementul de pe server
                .then(res=>{
                    deleteFromDatabase(elementId)                                // sterge elementul din baza de date
                        .then(res=>{
                            console.log('successfully deleted from db')
                            dispatch({
                                type:'DELETE',
                                payload: elementId
                            })
                            resolve(`Successfully deleted element with id ${elementId}`)
                        })
                        .catch(err=>{
                            console.log('err deleting from db', err.message)
                            reject(err)
                        })
                })
                .catch((err)=>{                                                         // Daca nu poate sterge elementul de pe server
                    console.log('Error connecting to server')
                    addToCRUDDatabase({id: elementId}, 'delete')     // adauga operatia in baza de date CRUD
                        .then(()=>{
                            deleteFromDatabase(elementId)                               // elementul se sterge din baza de date locala
                                .then(()=>{
                                    dispatch({
                                        type: 'DELETE',
                                        payload: elementId
                                    })
                                    console.log(`Successful offline delete element with id ${elementId}`)
                                })
                                .catch((err)=>{
                                    dispatch({
                                        type: 'DELETE',
                                        payload: elementId
                                    })
                                    console.log('Cannot write offline op, op only available online')
                                    resolve('Successful delete offline but not persisted change')
                                })
                        })
                        .catch((err)=>{
                            console.log('Cannot write offline op, op only available online')
                            reject(err)
                        })
                    reject(err)
                })
        })
    }
}

