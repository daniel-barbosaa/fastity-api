import { v4 as uuidv4 } from 'uuid';
import { sql } from "../db.js"

export class Users {

    async list() {
        const users = await sql`select * from users`

        return users
    }

    async create(user) {
        const userId = uuidv4()

        const { name, email, password } = user

        const users = await sql`select * from users`

        await sql`insert into users (id, name,email, password) VALUES (${userId}, ${name}, ${email}, ${password})`

    }

    update(id, user) {

    }

    async delete(email) {
        await sql`delete from users where email = ${email}`
    }
}
