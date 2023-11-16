import { sql } from './db.js'

// Deletando uma tabela no banco
// sql`DROP TABLE IF EXISTS orders;`.then(() => {
//     console.log("Tabela deletada!")
// })

sql`
CREATE TABLE orders (
    orderId TEXT,
    name TEXT,
    date TEXT ,
    location TEXT,
    quantity INTEGER
);
`.then(() => {
    console.log('Tabela criada!')
})