const express = require('express');
const app = express();
const storage = require('node-persist');

// Initialize storage
storage.init();

app.use(express.json());

//POST request to add the students
app.post('/add', (req, res) => {
    const { studentID, studentName, gpa } = req.body;
    storage.setItem(studentID, { studentID, studentName, gpa });

    res.status(201).json({ message: "Student added successfully!" });
});

//GET request of a particular student
app.get('/student/:id', async (req, res) => {
    const studentID = req.params.id;
    const student = await storage.getItem(studentID);
    //If student ID found or not then displays the output in console according to the conditions specified
    if (student) {
        res.send(`
        <h1>Student Data</h1>
        <h3>Student ID: ${student.studentID} </h3>
        <h3>Student Name: ${student.studentName} </h3>
        <h3>Student GPA: ${student.gpa} </h3>`);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

//GET request to get details of all students
app.get('/allStudents', async (req, res) => {
    const resp = await storage.values();
    let myresp = `<h1>Student Details</h1>`;
    for (let student of resp) {
        myresp += `
        <h3>Student ID: ${student.studentID} </h3>
        <h3>Student Name: ${student.studentName} </h3>
        <h3>Student GPA: ${student.gpa} </h3>`;
    }
    res.send(myresp);
});

//Get request to get a topper among all students
app.get('/topper', async (req, res) => {
    const topperStudents = await storage.values();
    let highestGPA = 0;
    let topper = null;

    for (const student of topperStudents) {
        if (student.gpa > highestGPA) {
            highestGPA = student.gpa;
            topper = student;
        }
    }
    //If-Else Loop for displaying topper student if found or not
    if (topper) {
        res.send(`
        <h1>Topper</h1>
        <h3>Student ID: ${topper.studentID} </h3>
        <h3>Student Name: ${topper.studentName} </h3>
        <h3>Student GPA: ${topper.gpa} </h3>`);
    } else {
        res.status(404).json({ error: "No students in class" });
    }
});

//PORT NUMBER which is to be added as the path number in browser or postman
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
