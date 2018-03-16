const mysql = require('mysql');
const fs = require('fs');
const connection = require('../../data/dbSettings');
function assignment(app) {

    app.post('/api/assignment', (req, res) => {

        const assignment = req.body;

        // Create entry in database
        const db = mysql.createConnection(connection);

        db.connect();


        const tasks = assignment.tasks.map(val =>{
            let arr = [];
            arr.push(null);
            arr.push(val);
            return arr;
        });
        console.log(tasks);
        const insertTasks= 'INSERT INTO tasks(TaskID,Name) VALUES ?';
        const query = db.query(insertTasks,[tasks], (error, results, fileds) => {

            console.log(query.sql);
            console.error(error);
            console.log(results);
            

        })
    })
}

module.exports = exports = assignment;