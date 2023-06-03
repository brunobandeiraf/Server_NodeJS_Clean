import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

// Query Parameters: URL Stateful -utilizados em filtros, paginação...
// ex. http://localhost:3333/users?userId=1&name=Bruno

// Route Parameters: Idnetificação de recurso. Não pode ser utilizado 
// para envio de informação sensível. 
// GET http://localhost:3333/users/1
// DELETE http://localhost:3333/users/1

// Request Body: Envio de informação de um formulário (HTTPs). 
// A informação é enviada no body
// POST http://localhost:3333/users 

const database = new Database()

export const routes = [
  //Method Select
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select('users', search ? {
        //Buscando em ambos os campos
        name: search,
        email: search
      } : null)

      return res.end(JSON.stringify(users))
    }
  },
  
  //Method Create
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name, email } = req.body
      const user = {
        //O id é gerado automaticamente utilizando o randomUUID
        id: randomUUID(),
        name,
        email,
      }

      database.insert('users', user)

      return res.writeHead(201).end()
    }
  },
  
  //Method Update
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { name, email } = req.body

      database.update('users', id, {
        name,
        email,
      })

      return res.writeHead(204).end()
    }
  },
  
  //Method Delete
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('users', id)

      return res.writeHead(204).end()
      //Resposta de sucesso sem conteúdo
    }
  }
]