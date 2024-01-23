import {fastify} from 'fastify';
import fastifyCors from '@fastify/cors';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { sql } from "../db.js"
import { Orders } from './order-database.js';
import { Users } from './user-database.js';


const server = fastify();

server.register(fastifyCors)



const port = 3001;



// Método GET, POST, PUT, REMOVE

const database = new Users()

const databaseOrders = new Orders

server.get('/', ( response) => {
  return response.send("hello world")
})
// Register user
server.post('/register', async (req, resp) => {
  const { name, email, password } = req.body

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email(),
    password: Yup.string().required().min(6),
  })

  try {
    schema.validateSync(req.body, { abortEarly: false })
  } catch (err) {
    return resp.status(400).send({ error: err.errors })
  }

  const users = await sql`select * from users`

  const usersExistents = users.find((user) => {

    if (email === user.email) {
      return resp.status(409).send({
        error: true,
        messagem: "Usuário já existe!"
      })
    } else {
      return false
    }
  })

  if (!usersExistents) {
    await database.create({
      name: name,
      email: email,
      password: password
    })

    return resp.status(201).send({
      error: false,
      messagem: "Usuário criado com sucesso!"
    })

  }
});

// Login
server.post('/session', async (req, resp) => {
  const { email, password } = req.body


  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required().min(6),
  })
  try {
    schema.validateSync(req.body, { abortEarly: false })
  } catch (err) {
    return resp.status(400).send({ error: err.errors })
  }

  const users = await sql`select * from users`
  const user = users.find((user) => user.email === email)

  if(!user) {
    console.log('usuario nao encontrado')
    return resp.status(404).send({
      error: true,
      messagem: "Usuário não encontado!"
    })
  }

  if (password !== user.password ) {
    return resp.status(403).send({
      error: false,
      messagem: "Senha incorreta!"
    })
  }

  return resp.status(200).send({
    // error: false,
    // messagem: "Logado com sucesso!",
    email: user.email,
    id: user.id,
    name: user.name

  })
});

server.get('/users', async () => {
  const users = await database.list()
  return users
});

// For testing only
server.delete('/delete-user/:email', async (req, resp) => {
  const userId = req.params.email

  await database.delete(userId)

  return resp.status(204).send()
})


// ORDERS 
server.get('/orders', async (req, resp) => {
 
  const orders = await databaseOrders.list()
  return orders
})

server.get('/orders/:id', async (req, resp) => {
  const orderId = req.params.id

  const orders = await databaseOrders.list(orderId)
  return orders
})

server.delete('/orders/:id', async (req, resp) => {
  const orderId = req.params.id

  await databaseOrders.delete(orderId)

  return resp.status(204).send({
    error: false,
    messagem: "Deletado com sucesso!"
  })
})




server.post('/create-order', async (req, resp) => {
  const { orderId, name, date, location, quantity } = req.body

  const schema = Yup.object().shape({
    orderId: Yup.string().required(),
    name: Yup.string().required(),
    date: Yup.string().required(),
    location: Yup.string().required(),
    quantity: Yup.number().required(),
  })

  try {
    schema.validateSync(req.body, { abortEarly: false })
  } catch (err) {
    return resp.status(400).send({ error: err.errors })
  }

  await databaseOrders.create({
    orderId: orderId,
    name: name, 
    date: date,
    location: location,
    quantity: quantity 
  })

  return resp.status(200).send({
    error:false,
    messagem: "Compra feita com sucesso!"
  })
  
 
})

server.listen(
  {
    port: process.env.PORT ?? port
  },
  console.log('Deu certo parça 👌'),
);
