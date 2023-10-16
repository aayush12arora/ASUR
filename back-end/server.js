const express=require('express');
const app=express();
const mysql = require('mysql');


const port=process.env.PORT || 3000;

/*

FOR UNIFORMITY
KEEP DATABASE NAME AS asur
*/

const dbName="asur"
const userName="root"
const passw="RahulSQL2002"//change this when using on your local machine



const connection = mysql.createConnection({
  host: "localhost",
  user: userName,
  password: passw,//my database password
  database: dbName,
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/api/getCourseList',(req,res)=>{
  //to get the course list from the subject table

  //CHANGE TABLE NAME
  const query = "SELECT * FROM subject";
  connection.query(query, (error, results) => {
  if (error) throw error;
  // console.log(results);
  res.json(results);
});
})

//ENDPOINT FOR OVERALL ATTENDANCE PERCENT FETCHING for a particular student
app.get('/api/getAttendancePercent/:studentRollNum',(req,res)=>{
  //right now taking from params need to implement security by sending some token from firebase
  const studentRollNum = req.params.studentRollNum;
  const query=`
  select Roll_no,Count(Distinct Date) as datesPresent,
  SUM(CASE when PorA='P' then 1 else 0 end) as presentCount,(SUM(CASE when PorA='P' Then 1 else 0 end)/ COUNT(Distinct Date))*100 
  as Percentage from attendance_details
  where roll_no=${studentRollNum}
  group by roll_no;
  `
  connection.query(query,(error,results)=>{
    if (error) throw error;
    res.json(results)
  })
})

app.get('/api/getProfile/:studentID',(req,res)=>{
  //to get student details from student table


  //CHANGE STUDENT TABLE NAME IF NEEDED ACC TO YOUR DB
  const id= req.params.studentID;
  const query=`SELECT * from student where Roll_No= ${id}`
  connection.query(query, (error, results) => {
      if (error) throw error;
      // console.log(results);
      res.json(results);
    });

})


app.get('/api/getClassroomDetails', (req, res) => {
    // Assuming you have a database connection object named 'db'
    const coursecode = req.query.coursecode; // Access coursecode from the URL query params
    console.log('Received coursecode:', coursecode);
  
    // Replace 'student_table' with your actual student table name
    const query = `SELECT * FROM classroom WHERE room_id = (SELECT classroom_id FROM subject WHERE subject_id = '${coursecode}')`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving classroom details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // Assuming your classroom details are returned as an array of objects
      const classroomDetails = results[0]; // Get the first (and only) row
  
      if (!classroomDetails) {
        console.error(`Classroom not found for coursecode: ${coursecode}`);
        res.status(404).json({ error: 'Classroom not found' });
        return;
      }
  
      res.status(200).json({ classroomDetails });
    });
  });
  
  

//the above login endpoint will get image from this endpoint
app.get('/api/image/:studentID',(req,res)=>{

})


app.post('/api/markAttendance',(req,res)=>{
    //to insert attendance details into attendance table
    //need to generate unique ID based on date or row number
})

app.get('/api/getAttendance',(req,res)=>{
    //to get attendance details and display it in app
})


app.get('/api/homePagedetails')


app.listen(port,()=>{
    console.log(`listening on ${port}`);
});