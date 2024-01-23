import { v4 as uuidv4 } from 'uuid';
import { sql } from "../db.js"

export class Orders {

    async list(id) {

        if(id){
            const order = await sql`select * from orders where orderId = ${id}`
            return order
        }

        const orders = await sql`select * from orders`

        return orders
    }

    async create(order) {

        const { orderId, name, location, date, quantity } = order

        const orders = await sql`select * from orders`


        await sql`insert into orders (orderId, name,location, date, quantity ) VALUES (${orderId}, ${name}, ${location}, ${date}, ${quantity})`

    }

    update(id, user) {

    }

    async delete(id) {
        await sql`delete from orders where orderId = ${id}`
    }
}
