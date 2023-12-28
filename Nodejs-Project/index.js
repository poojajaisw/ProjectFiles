const express = require('express');
const app = express();
const storage = require('node-persist');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
storage.init();

// let's retrieve the all students data and print it on '/student' route on browser
app.get('/allStudent', async (req, res) => {

    let i = await storage.keys();

    if (i.length > 0) {

        let result = await storage.values();

        // writes the data to the page
        res.write(`
                <div>
                    <h1>All students data</h1>
                </div>
        `);

        // fetches data one after another from storage 
        await storage.forEach(async function (datum) {
            res.write(`
                <div>  
                    <h2>Student id: ${datum.value.student_id}</h2>
                    <h3>Name: ${datum.value.student_name}</h3>
                    <h3>GPA: ${datum.value.gpa}</h3>
                </div>
            `);

        })
        // closing response after writing..
        res.end();

    }
    else {
        res.send("user not found!");
        console.log("user not found!");
    }
})


// retrieving perticular student data based on his id 
app.get('/student/:id', async (req, res) => {
    if ((await storage.keys()).includes(req.params.id)) {
        const datum = await storage.getDatum(req.params.id);

        // console.log(datum);
        res.send(`
            <div>
                    <h1>${datum.value.student_id} Student Details: </h1>
                    <h2>Student id: ${datum.value.student_id}</h2>
                    <h3>Name: ${datum.value.student_name}</h3>
                    <h3>GPA: ${datum.value.gpa}</h3>
            </div>
        `);
    } else {
        res.send("User Not found!");
    }
})


// retrieving topper among students
app.get('/topper', async (req, res) => {
    let max = 0;
    var topper_id = "";

    let b = await storage.values();
    b.forEach((e, index) => {
        // console.log(parseFloat(e.gpa));
        if (parseFloat(e.gpa) > max) {
            max = parseFloat(e.gpa);
            topper_id = parseInt(e.student_id);
        }
    })
    console.log(topper_id);

    const datum = await storage.getDatum(topper_id + "");

    console.log(datum);
    res.send(`
            <div >
                    <h1>${datum.value.student_id} Details: </h1>
                    <h2>Student id: ${datum.value.student_id}</h2>
                    <h3>Name: ${datum.value.student_name}</h3>
                    <h3>GPA: ${datum.value.gpa}</h3>
            </div>
        `);

})


app.post('/student', jsonParser, async (req, res) => {
    const { student_id, student_name, gpa } = req.body;
    let data = { student_id, student_name, gpa };




    if ((await storage.keys()).includes(req.body.student_id)) {
        res.send("Student Already Exist!");
    } else {
        await storage.setItem(student_id, "data");
        res.send("Added Student.");
    }

})



// listening on the port 3000 while server is on,
app.listen(5000, () => {
    console.log("server started");
})