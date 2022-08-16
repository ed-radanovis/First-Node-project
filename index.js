

// const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

// => Query params ...  meusite.com/users?name=edmar&age=41  // são os filtros.
// => Route params ...  /users/2                             // Buscar, Deletar ou Atualizar algo ESPECÍFICO.  
// => Request Body ... {"name":"Edmar Radanovis", "age":41}

// GET         ... Buscar informações no back-end
// POST        ... Criar informações no back-end
// PUT / PATCH ... Alterar / Atualizar informações no back-end
// DELETE      ... Deletar informações no back-end

// Middleware => INTERCEPTADOR => tem o poder de parar ou alterar dados da requisição




// app.get('/users', (request, response) => {
//     const { name, age } = request.query // padrão DESTRUCTURING ASSIGNMENT

//    return response.json({name, age })
// }) 

// app.listen(port, () => {
//     console.log(`⚡🏆 Server started on port ${port} 🏆⚡`)
// })

const users = []       // ===> // Estas informações estão guardadas em váriáveis p/ fins didáticos. Em produção (vida real) isso nunca 
//         acontece, pois, tais informações são guardadas em BANCOS DE DADOS, caso contrário, se por exemplo o 
//         servidor NODE seja reiniciado, seriam perdidos todos dados das variáveis.
const checkUserId = (request, response, next) => {
    const { id } = request.params  // recortado da rota put

    const index = users.findIndex(user => user.id === id)  // recortado da rota put

    if (index < 0) {                                          // recortado da rota put
        return response.status(404).json({ error: "User not found" })
    }
    
    request.userIndex = index
    request.userId = id

    next()

}

app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)    // Atenção aqui ... foi alterado para USER por causa do PUSH (puxar somente 1 usuário e não todos)
})                                            // Foi incluido também o .status(201): por padrão o express está retornando status 200 como pode
// ser observado nos anteriores. Para ficar semânticamente correto, quando o back-end cria uma nova
// informação, e essa foi criada com sucesso, deve retornar status 201 (protocolo http). 

app.put('/users/:id', checkUserId, (request, response) => {       // Utilizar Route params para localizar ID (após users ... /:id) 
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId
    
    const updateUser = { id, name, age }

    users[index] = updateUser

    return response.json(updateUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {    // Utilizar Route params para localizar ID (após users ... /:id)
    const index = request.userIndex

    users.splice(index,1)      // aulas sobre array -> SPLICE ... deleta itens de um array a partir de um índice

    return response.status(204).json()      // Não quer retornar o usuário, pois já foi deletado. 
})                                          // Então emite a menssagem de sucesso junto com STATUS 204 (sem conteúdo)

app.listen(port, () => {
    console.log(`⚡🏆 Server started on port ${port} 🏆⚡`)
})