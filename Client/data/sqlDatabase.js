import * as SQLite from 'expo-sqlite'
import {
    addToCRUDDatabaseCommand,
    addToDatabaseCommand, createCRUDTableCommand,
    createTableCommand, deleteCommand,
    dropTableCommand, mapEntityToList,
    nameDB,
    readAllCommand,

} from "./config";

const sqlDatabase = SQLite.openDatabase(nameDB)
export default sqlDatabase

export function addToDatabase(element){
    return new Promise((resolve,reject) => {
        sqlDatabase.transaction(tx=>{
            tx.executeSql(
                addToDatabaseCommand,
                mapEntityToList(element),
                (transaction, resultSet) => {
                    // console.log(resultSet)
                    resolve(resultSet)
                },
                (transaction,error) =>{
                    console.log('Cannot add, sorry', error.message)
                    reject(error)
                })
        })
    })
}
export function addToCRUDDatabase(element, operationType){
    return new Promise((resolve,reject) => {
        sqlDatabase.transaction(tx=>{
            tx.executeSql(
                addToCRUDDatabaseCommand,
                [Math.floor(Math.random()*9999),operationType,...mapEntityToList(element)],
                (transaction, resultSet) => {
                    // console.log(resultSet)
                    resolve(resultSet)
                },
                (transaction,error) =>{
                    console.log('Cannot add, sorry', error.message)
                    reject(error)
                })
        })
    })
}

// Functie care sterge elementul din baza de date
export function deleteFromDatabase(elementId){
    return new Promise((resolve, reject)=>{
        sqlDatabase.transaction(tx=>{
            tx.executeSql(deleteCommand, [elementId],(tx,res)=>{
                console.log('Element sters din DB')
                resolve('Succes')
            },
                ()=> {
                    console.log('Elementul nu afost sters din DB')
                    reject('Esec')
                })
        })
    })
}
export function deleteCRUDFromDatabase(crudId){
    return new Promise((resolve, reject)=>{
        sqlDatabase.transaction(tx=>{
            tx.executeSql('DELETE FROM crud WHERE crudId=?', [crudId],(tx,res)=>{
                    console.log('Element sters din Crud DB')
                    resolve('Success')
                },
                ()=> {
                    console.log('Elementul nu afost sters din Crud DB')
                    reject('Esec')
                })
        })
    })
}

export function createTableInDataBase(){
    return new Promise((resolve, reject) =>{
        sqlDatabase.transaction(tx => {
            const command = createTableCommand
            tx.executeSql(command,[],
                ()=>{
                    console.log("Tabela exista")
                    resolve("Operatiune efectuata cu succes!")
                },
                ()=>{
                    console.log("Tabela nu a fost creata!")
                    reject("Failed")
            })
        })
    })
}
export function createCRUDTableInDataBase(){
    return new Promise((resolve, reject) =>{
        sqlDatabase.transaction(tx => {
            const command = createCRUDTableCommand
            tx.executeSql(command,[],
                ()=>{
                    console.log("Tabela CRUD exista")
                    resolve("Operatiune efectuata cu succes!")
                },
                (tx,err)=>{
                    console.log(err)
                    console.log("Tabela CRUD nu a fost creata!")
                    reject("Failed")
                })
        })
    })
}

export function readAllFromDataBase(){
    return new Promise((resolve, reject) =>{
        sqlDatabase.readTransaction(tx=>{
            tx.executeSql(readAllCommand,[],
                (tx, resultSet)=>{
                    console.log("S-a citit din tabela ")
                    resolve(resultSet.rows._array)
                },
                (tx, error)=>{
                    console.log("Nu s-a citit din tabela ")
                    reject(error.message)
                })
        })
    })
}
export function readAllCRUDFromDataBase(){
    return new Promise((resolve, reject) =>{
        sqlDatabase.readTransaction(tx=>{
            tx.executeSql('SELECT * FROM crud',[],
                (tx, resultSet)=>{
                    console.log("S-a citit din tabela ")
                    resolve(resultSet.rows._array)
                },
                (tx, error)=>{
                    console.log("Nu s-a citit din tabela ")
                    reject(error.message)
                })
        })
    })
}

export function dropTable(){
    return new Promise((resolve, reject) => {
        sqlDatabase.transaction(tx => {
            const command1 = dropTableCommand
            tx.executeSql(command1,[],()=>{
                console.log("Tabelul a fost sters")
                resolve("Tabelul a fost sters")
            },
                ()=>{
                    console.log("Tabelul nu a fost sters")
                    reject("Tabelul nu a fost sters")
                })
        })
    })
}
export function dropTableCRUD(){
    return new Promise((resolve, reject) => {
        sqlDatabase.transaction(tx => {
            const command1 = 'DROP TABLE crud'
            tx.executeSql(command1,[],()=>{
                    console.log("Tabelul CRUD a fost sters")
                    resolve("Tabelul CRUD a fost sters")
                },
                ()=>{
                    console.log("Tabelul CRUD nu a fost sters")
                    reject("Tabelul CRUD nu a fost sters")
                })
        })
    })
}

