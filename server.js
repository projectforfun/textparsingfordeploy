const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');
let tokensInfos = {};


class HandlerGenerator {
    login (req, res) {
        let email = req.body.email;
        // For the given username fetch user from DB
        let mockEmail = 'foo@bar.com';

        if (email ) {
            if (email === mockEmail) {
                let token = jwt.sign({email: email},
                    config.secret,
                    { expiresIn: '24h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }
    index (req, res) {
        res.json({
            success: true,
            message: 'Index page'
        });
    }

    justify(req,res){
        console.log('req.body : '+req.body);
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if(tokensInfos[token]===undefined){
            tokensInfos[token]={
                words:0,
                date:new Date()
            }
        }
        let day = tokensInfos[token].date;
        day = day.getDate();
        let currentDate = new Date();
        let currentDay = currentDate.getDate();

        if (currentDay !== day) {
            tokensInfos[token].date = currentDay;
            tokensInfos[token].words = 0;
        }
        const array = req.body.split(/\n|\s/);

        console.log(tokensInfos);
        tokensInfos[token].words += array.length;
        if(tokensInfos[token].words > 80000)
            res.status(402).json({ success: false, message: '402 Payment Required.' });
        else {

            let index = 0;
            let finalLines = [""];
            array.forEach((str) => {
                if (finalLines[index].length + str.length <= 80) {
                    finalLines[index] += str + ' ';
                } else {
                    finalLines[index] = finalLines[index].substr(0, finalLines[index].length - 1);
                    if (finalLines[index].length !== 80) {
                        let difference = 80 - finalLines[index].length;
                        const space = /\s/g;
                        let spaces = [];
                        let spaceIndexesArray=[];
                        while ((spaceIndexesArray = space.exec(finalLines[index])) !== null) {
                            spaces.push(spaceIndexesArray.index);
                        }
                        spaces = spaces.reverse();
                        let i = 0;
                        while (difference > 0) {
                            finalLines[index] = finalLines[index].split('');
                            finalLines[index].splice(spaces[i], 0, ' ');
                            finalLines[index] = finalLines[index].join('');
                            i++;
                            difference--;
                        }
                    }
                    index++;
                    finalLines[index] = "";
                    finalLines[index] += str + ' ';
                }
            });
            finalLines[index] = finalLines[index].substr(0, finalLines[index].length - 1);
            //console.log("finalLines-------------------------");
            let finalResult="";
            finalLines.forEach((e)=>{
                //console.log(e);
                finalResult+=e;
                res.write(e+'\n');

            });
            return res.end('');
        }
    }
}

// Starting point of the server
function main () {
    let app = express(); // Export app for other routes to use
    let handlers = new HandlerGenerator();
    const port = process.env.PORT || 8000;
    app.use(bodyParser.urlencoded({ // Middleware
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    // Routes & Handlers
    app.post('/api/token', handlers.login);
    app.get('/api', middleware.checkToken, handlers.index);
    app.post('/api/justify',middleware.checkToken,handlers.justify);
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();
