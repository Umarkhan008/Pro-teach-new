import style from "./App.module.css"
import { Link, useNavigate } from 'react-router-dom';
import back from '../assets/bac.mp4'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { useState } from "react";
import { useEffect } from "react";
import BasicNavbar from "./BasicNavbar";

const firebaseConfig = {
    apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
    authDomain: "project-pro-7f7ef.firebaseapp.com",
    databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
    projectId: "project-pro-7f7ef",
    storageBucket: "project-pro-7f7ef.firebasestorage.app",
    messagingSenderId: "782106516432",
    appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
    measurementId: "G-WV8HFBFPND"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);



function App() {
    const navigate = useNavigate()
    const studentData = JSON.parse(localStorage.getItem("StudentData"))
    const [takeStudents, setTakeStudents] = useState([])

    useEffect(() => {
        const students = ref(database, "Students")

        onValue(students, (snapshot) => {
            const data = snapshot.val();

            setTakeStudents(Object.values(data || {}));
        });

    }, [])

    console.log(takeStudents)

    return (
        <div>
            <div className={style.chat}></div>
            <BasicNavbar/>
            <div className={style.main}>
                <video autoPlay loop>
                    <source src={back} />
                </video>
                <div className={style.levels} >
                    <h1>1-Daraja</h1>
                    <div className={style.table}>
                        {
                            takeStudents.filter(studentBall => studentBall.ball >= 60).map((student) => (
                                <div className={`${student.id === studentData.id ? "text-red-500" : ""} flex justify-between`}>
                                    <h3>
                                        {student.studentName}
                                    </h3>
                                    <h3>
                                        {student.ball}
                                    </h3>
                                </div>
                            ))
                        }  
                    </div>
                </div>
                <div className={style.levels} >
                    <h1>2-Daraja</h1>
                    <div className={style.table}>
                        {
                            takeStudents.filter(studentBall => studentBall.ball >= 30 && studentBall.ball <= 60).map((student) => (
                                <div className={`${student.id === studentData.id ? "text-red-500" : ""} flex justify-between`}>
                                    <h3>
                                        {student.studentName}
                                    </h3>
                                    <h3>
                                        {student.ball}
                                    </h3>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={style.levels}>
                    <h1>3-Daraja</h1>
                    <div className={style.table}>
                        {
                            takeStudents.filter(studentBall => studentBall.ball <= 30).map((student) => (
                                <div className={`${student.id === studentData.id ? "text-red-500" : ""} flex justify-between`}>
                                    <h3 >
                                        {student.studentName}
                                    </h3>
                                    <h3>
                                        {student.ball}
                                    </h3>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className={style.game}>🔁</div>
                <div className={style.userSettings} id="userSettings">
                    ⚙️
                </div>
            </div>
        </div>
    );
}

export default App;