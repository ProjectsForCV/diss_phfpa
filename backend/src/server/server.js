/***********************************************************************
 * Date: 01/12/2017
 * Author: Daniel Cooke
 ***********************************************************************/
// DCOOKE 01/12/2017 - TODO: This will need to be hosted on digital ocean for testing purposes
const express = require('express');
const app = express();
const port = 4000;


app.get('/', (request, response) => {

    response.send("Hello World")
});


app.listen(port, (err) =>{

    if (err) {
        return console.log(err)
    }

    console.log(`server is listening on ${port}`)
});
