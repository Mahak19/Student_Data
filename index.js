const express = require('express');
const app = express();
const storage = require('node-persist');

storage.init();

app.use(express.json());

app.post('/add', (req, res) => {
    const { studentID, studentName, gpa } = req.body;
    storage.setItem(studentID, { studentID, studentName, gpa });

    res.status(201).json({ message: "Student added successfully!" });
});

//
app.get('/student:/studentID', async (req, res) => {
    const studentID = req.params.id;
    const student = await storage.getItem(studentID);

    if (student) {
        res.send(`
        <h1>Student Data</h1>
        <h3>Student ID: ${studentID} </h3>
        <h3>Student Name: ${studentName} </h3>
        <h3>Student GPA: ${gpa} </h3>`);
    } else {
        res.status(404).json({ error: "Stident not found" });
    }
});

//
app.get('/allStudent', async (req, res) => {
    const resp = await storage.values();
    let myresp = `<h1>Student Detail</h1>`;
    for (let student of resp) {
        `
    myresp += 
    <h3>Student ID: ${student.studentID} </h3>
    <h3>Student Name: ${student.studentName} </h3>
    <h3>Student GPA: ${student.gpa} </h3>`
    }
    res.send(myresp);
});

//
app.get('/topper', async (req, res) => {
    const topperStudents = await storage.values();
    let highestGPA = 1;
    let topper = null;

    for (const student of topperStudents) {
        if (student.gpa > highestGPA) {
            highestGPA = student.gpa;
            topper = student;
        }
    }

    if (topper) {
        res.send(`
        <h1>Topper</h1>
        <h3>Student ID: ${topper.studentID} </h3>
        <h3>Student Name: ${topper.studentName} </h3>
        <h3>Student GPA: ${topper.gpa} </h3>`);
    } else {
        res.status(404).json({ error: "No students in class" });
    }
})

//
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})