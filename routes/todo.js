const express = require('express')
const { query } = require('../helpers/db.js')

const todoRouter = express.Router()

todoRouter.get("/",async (req, res) => {
console.log(query)
try {
    const result = await query('SELECT * FROM task')
    const rows = result.rows ? result.rows : []
    res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        //res.statusMessage = error
        res.status(500).json({error: String(error)})
    }
})

todoRouter.post("/new",async (req, res) => {
    try {
        const result = await query('insert into task (description) values ($1) returning *',
            [req.body.description])
            res.status(200).json({id:result.rows[0].id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

todoRouter.delete("/delete/:id", async(req,res) => {
    const id = Number(req.params.id)
    try{
        const result = await query('delete from task where id = $1',
            [id])
            res.status(200).json({id:id})
    } catch(error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

//debugging
todoRouter.get("/db-check", async (req, res) => {
  try {
    const info = await query(`
      SELECT
        current_database() AS db,
        current_user AS db_user,
        inet_server_addr() AS host,
        inet_server_port() AS port,
        current_schema() AS schema
    `);

    const tables = await query(`
      SELECT schemaname, tablename
      FROM pg_tables
      WHERE tablename = 'task'
    `);

    res.status(200).json({
      info: info.rows[0],
      task_table: tables.rows
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

module.exports = {
    todoRouter
}