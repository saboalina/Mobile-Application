import axios from "axios";
import {
    addElementPath, deleteElementPath,
    filteredPath, findElementPath,
    getAllElementsPath,
    server_port,
    server_url, updateFieldsPath,
    updatePath
} from "./config";


export const server = axios.create({baseURL:`http://${server_url}:${server_port}`})

// functie care ia toate elementele de pe server de la endpoint-ul getAllElementsPath
export function getElementsFromServer(){
    return new Promise((resolve, reject) => {
       server.get(getAllElementsPath,{timeout:1000})
           .then(serverResponse =>
               resolve(serverResponse.data)
           )
           .catch(error => {
               console.log('error reading from server')
               reject(error.message)
           })
    })
}

export function addElementToServer(element){
    return new Promise((resolve, reject)=>{
        server.post(addElementPath,{...element},{timeout:1000})
            .then(serverResponse => {
                resolve(serverResponse.data)
            })
            .catch(err => {
                console.log('error', err.message)
                reject(err.message)
            })
    })
}

export function getFilteredData(){
    return new Promise((resolve, reject) => {
        server.get(filteredPath,{timeout:1000})
            .then(serverResponse => {
                resolve(serverResponse.data)
            })
            .catch(err => {
                console.log('error fetching data')
                reject(err)
            })
    })
}

// modifica din free in take
export function updateElementOnServer(elementId){
    return new Promise((resolve, reject) => {
        server.post(updatePath,{id: elementId },{timeout:1000})
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                console.log('Cannot update data')
                reject(err)
            })
    })
}

// Functie care primeste id-ul unui element si il sterge de pe server
export function deleteElementOnServer(elementId){
    return new Promise((resolve, reject) => {
        server.delete(`${deleteElementPath}/${elementId}`,{timeout:1000})
            .then((res)=>{
                resolve(res.data)
            })
            .catch((err)=>{
                console.log('Cannot delete data')
                reject(err)
            })
    })
}

export function  findElement(elementId){
    return new Promise((resolve, reject) => {
        server.get(`${findElementPath}/${elementId}`,{timeout:1000})
            .then((res)=>{
                resolve(res.data)
            })
            .catch(err => {
                console.log('error fetching data')
                reject(err)
            })
    })
}

export function  updateElementFieldsOnServers(element){
    return new Promise((resolve, reject) => {
        server.post(updateFieldsPath,{...element},{timeout:1000})
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                console.log('Cannot update data')
                reject(err)
            })
    })
}















