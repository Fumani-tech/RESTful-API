const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1, name:"Math"},
    {id:2, name:"English"},
    {id:3, name:"Life science"},
];

app.get("/", (req, res) => {                                       
    res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.post("/api/courses", (req, res) => {

    const {error} = validateCourse(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const course = {
        id: courses.length+1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
    //first lookup/find course
    //if not found return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) {
        res.status(404).send("The course with the given ID was not found.");
        return;
    }
    //validate 
    // if invalid return 404-bad request
    const {error} = validateCourse(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course
    course.name = req.body.name;
    //return the updated course
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);

}


app.get("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send("The course with the given ID was not found.");
    res.send(course)
});
app.delete("/api/courses/:id", (req, res) => {
    // lookup course
    //if not found return 404-not found
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) {
        res.status(404).send("The course with the given ID was not found.");
        return;
    }
    //if found delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return deleted course
    res.send(course);

});

const port = process.env.PORT|| 3000;
app.listen(port, () => 
    console.log(`Listening on ${port}`));
