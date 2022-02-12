export const server_url = '192.168.1.128' // il iei din expo
export const server_port = '2019'
export const nameDB = 'accessDB3'
// ------------------------------------------------
// ---- MANAGEMENT SECTION
export const createTableCommand = 'CREATE TABLE IF NOT EXISTS access (id INTEGER PRIMARY KEY, name TEXT, level INTEGER, status TEXT, fromm INTEGER, too INTEGER)'
export const addToDatabaseCommand = "INSERT INTO access VALUES (?,?,?,?,?,?)"
export const createCRUDTableCommand = 'CREATE TABLE IF NOT EXISTS crud (crudId INTEGER PRIMARY KEY AUTOINCREMENT,  operationType TEXT, id INTEGER, name TEXT, level INTEGER, status TEXT, fromm INTEGER, too INTEGER)'
export const addToCRUDDatabaseCommand = "INSERT INTO crud VALUES (?,?,?,?,?,?,?,?)" // cu 2 x ? in plus, pentru operation si pentru ID

export const readAllCommand = 'SELECT * FROM access'
export const dropTableCommand = 'DROP TABLE access'

export const deleteCommand = 'DELETE FROM access WHERE id=?'


export const mapEntityToList = (entity) =>[
    entity.id,
    entity.name,
    entity.level,
    entity.status,
    entity.from,
    entity.to,]

export const addElementPath = '/rule'      // (1.a)
export const getAllElementsPath = '/rules' // (1.b)
export const deleteElementPath = '/space'   // (1.c)
// cand intra doi clienti - unul face add => ii apare si celuilalt ce o adaugat primul
export const solveServerUpdateMessage = (entity) => (`Name: ${entity.name}, Level: ${entity.level}, Status: ${entity.status}, From: ${entity.from}, To: ${entity.to} `)

//----------------------------------
// --- USERS SECTION
export const filteredPath = '/level/1' // (2.b)
export const findElementPath = '/rule' // (2.c)
export const orderFunction = (elements) => {  // (2.a)
    return elements.sort((a,b) => {
        if (Number(a.from) > Number(b.from)) {return -1}
        if (Number(a.from) < Number(b.from)) {return 1}

        if (Number(a.to) > Number(b.to)) {return -1}
        if (Number(a.to) < Number(b.to)) {return 1}

        if (a.status > b.status) {return -1}
        if (a.status < b.status) {return 1}

        return 0
    })
}
export const filterFunction = (elements) =>{
    return elements.filter((a)=>{
        if(a.to-a.from > 5 && a.to-a.from <10 ) return true
        return false
    })
}
export const updatePath = '/take'
export const updateSuccessMessage = 'Successfully updated parking space status'
export const updateFieldsPath = '/update' //(1.d)
//-----------------------------------
//------- STATS


