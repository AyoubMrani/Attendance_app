import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../css/not_found.css';
import Swal from "sweetalert2";
import '../css/switch_toggle.css';

const EditAbsence = () => {
    const {id, date: paramDate} = useParams();
    const [professors, setProfessors] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(id || '');
    const [date, setDate] = useState(paramDate || '');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [noData, setNoData] = useState(false);
    const [safeMode, setSafeMode] = useState(true); // State for safe mode
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                const response = await axios.get(`${apiUrl}/professors`);
                setProfessors(response.data);
            } catch (error) {
                console.error('Error fetching professors:', error);
            }
        };

        fetchProfessors();
    }, []);

    useEffect(() => {
        if (selectedProfessor && date) {
            fetchAbsences();
        }
    }, [selectedProfessor, date]);

    const fetchAbsences = async () => {
        setIsLoading(true);
        setNoData(false);
        try {
            const response = await axios.get(`${apiUrl}/absence/${selectedProfessor}/${date}`);
            if (response.data.length === 0) {
                setNoData(true);
            } else {
                setStudents(response.data);
            }
        } catch (error) {
            console.error('Error fetching absence list:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (id) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.id === id ? {...student, isAbsent: !student.isAbsent} : student
            )
        );
    };

    const handleSave = async () => {
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(`${apiUrl}/absence/update`, {
                        currentDate: date,
                        choosedProfessor: selectedProfessor,
                        students
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Attendance list updated successfully"
                    });
                } catch (error) {
                    console.error('Failed to update absence list:', error);
                    Toast.fire({
                        icon: "error",
                        title: "Failed to update attendance list"
                    });
                }
                Swal.fire("Saved!", "", "success");
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    };

    return (
        <div>
            <h2 style={{marginLeft: "30px"}}>Edit Attendees List
            </h2>
            <span style={{float: "right"}}>
                <div className="checkbox-wrapper-35">
                  <input
                      defaultChecked={true}
                      value="private"
                      name="switch"
                      id="switch"
                      type="checkbox"
                      className="switch"
                      onChange={() => setSafeMode(!safeMode)} // Toggle safe mode
                  />
                  <label htmlFor="switch">
                    <span className="switch-x-text">Safe mode is </span>
                    <span className="switch-x-toggletext">
                      <span className="switch-x-unchecked"><span className="switch-x-hiddenlabel">Unchecked: </span>Off</span>
                      <span className="switch-x-checked"><span className="switch-x-hiddenlabel">Checked: </span>On</span>
                    </span>
                  </label>
                </div>
            </span>

            <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                <div>
                    <label style={{marginBottom: "10px"}}>
                        Date:
                        <input
                            className="form-control mb-3"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                    <label style={{marginBottom: "10px"}}>
                        Professor:
                        <select
                            className="form-control mb-3"
                            value={selectedProfessor}
                            onChange={(e) => setSelectedProfessor(e.target.value)}
                        >
                            <option value="" disabled>Select Professor</option>
                            {professors.map((professor) => (
                                <option key={professor.id} value={professor.id}>
                                    {professor.nom} {professor.prenom}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button
                    className={"btn btn-primary"}
                    onClick={fetchAbsences}
                    disabled={!date || !selectedProfessor}>
                    Fetch Absences
                </button>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : noData ? (
                <div className="main_wrapper">
                    <div className="main">
                        <div className="antenna">
                            <div className="antenna_shadow"></div>
                            <div className="a1"></div>
                            <div className="a1d"></div>
                            <div className="a2"></div>
                            <div className="a2d"></div>
                            <div className="a_base"></div>
                        </div>
                        <div className="tv">
                            <div className="cruve">
                                <svg
                                    className="curve_svg"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 189.929 189.929"
                                    xmlSpace="preserve"
                                >
                                    <path
                                        d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
        C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
                                    ></path>
                                </svg>
                            </div>
                            <div className="display_div">
                                <div className="screen_out">
                                    <div className="screen_out1">
                                        <div className="screen">
                                            <span className="notfound_text">List Not Found</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lines">
                                <div className="line1"></div>
                                <div className="line2"></div>
                                <div className="line3"></div>
                            </div>
                            <div className="buttons_div">
                                <div className="b1">
                                    <div></div>
                                </div>
                                <div className="b2"></div>
                                <div className="speakers">
                                    <div className="g1">
                                        <div className="g11"></div>
                                        <div className="g12"></div>
                                        <div className="g13"></div>
                                    </div>
                                    <div className="g"></div>
                                    <div className="g"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="base1"></div>
                            <div className="base2"></div>
                            <div className="base3"></div>
                        </div>
                    </div>
                </div>
            ) : (
                students.length > 0 && (
                    <div>
                        <table className='table table-striped table-hover'>
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Absent</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.map(student => (
                                <tr
                                    className={(student.isAbsent) ? 'table-danger' : ''}
                                    key={student.id}>
                                    <th>{student.id}</th>
                                    <td>{student.nom}</td>
                                    <td>{student.prenom}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={student.isAbsent}
                                            onChange={() => handleCheckboxChange(student.id)}
                                            disabled={safeMode} // Disable input if safe mode is on
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button
                            className={"btn btn-primary mb-3 float-end"}
                            onClick={handleSave}
                            disabled={safeMode} // Disable button if safe mode is on
                        >
                            Save Changes
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default EditAbsence;