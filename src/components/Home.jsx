import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Swal from "sweetalert2";

function Home() {
    const [students, setStudents] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [choosedProfessor, setChoosedProfessor] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const [currentDate, setCurrentDate] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Set today's date in YYYY-MM-DD format
        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Africa/Casablanca',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }); setCurrentDate(today);
        console.log(apiUrl)
        // Fetch students on mount
        axios.get(`${apiUrl}/professors`)
            .then(response => setProfessors(response.data))
            .catch(error => console.error('Error fetching professor:', error));
        axios.get(`${apiUrl}/students`)
            .then(response => setStudents(response.data))
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    const handleCheckboxChange = (id, isChecked) => {
        setStudents(students.map(student =>
            student.id === id ? { ...student, isAbsent: isChecked } : student
        ));
    };

    const handleProfessorChange = (e) => {
        const selectedProfessor = e.target.value;
        setChoosedProfessor(selectedProfessor);
        console.log(selectedProfessor); // Logs the selected professor ID immediately after change
    };


    const handleSubmitAll = (e) => {
        e.preventDefault();
        axios.post(`${apiUrl}/absent`, { currentDate, choosedProfessor, students })
            .then((response) => {
                const element = response.data.file;
                Swal.fire({
                    title: "Student submitted successfully",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#20a508",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Download"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const response = await axios.post(`${apiUrl}/download`, {
                                id: choosedProfessor,
                                element: element
                            }, {
                                responseType: 'blob', // Important to set the response type to 'blob'
                            });

                            // Create a link element to download the file
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `${element.replace('.json', '')}.csv`); // Set the file name
                            document.body.appendChild(link);
                            link.click();
                            link.remove(); // Clean up the link element
                        } catch (error) {
                            console.error('Error downloading the zip file', error);
                        }
                    }
                });

                // Clear all checkboxes by setting isAbsent to false for all students
                setStudents(students.map(student => ({ ...student, isAbsent: false })));

                console.log('Absence data updated successfully');
            })
            .catch(error => {
                Swal.fire({
                    title: "Error submitting list",
                    icon: "error",
                    timer: 5000,
                    timerProgressBar: true,
                });

                console.error('Error updating absence:', error);
            });
    };
    const filteredStudents = students.filter(student =>
        `${student.nom} ${student.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="Home">
            <form onSubmit={handleSubmitAll}>
                {/* Search Input */}
                <div className="container mt-3">
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="form-control mb-3"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />

                    {/* Date Input */}
                    <input
                        type="date"
                        className="form-control mb-3"
                        value={currentDate}
                        readOnly={true}
                        onChange={e => setCurrentDate(e.target.value)}
                    />

                    {/* prof Input */}

                    <select required={true} onChange={handleProfessorChange} className="form-control mb-3" name="professor" id="professor">
                        <option value="" disabled={true} selected={true}>Select Professor</option>

                        {professors.map(professor => (
                            <option key={professor.id} value={professor.id}>
                                {professor.nom} {professor.prenom}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Student Table */}
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
                        {filteredStudents.map(student => (
                            <tr key={student.id}>
                                <th>{student.id}</th>
                                <td>{student.nom}</td>
                                <td>{student.prenom}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={student.isAbsent}
                                        onChange={e => handleCheckboxChange(student.id, e.target.checked)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Submit All Button */}
                <button type="submit" className={"btn btn-primary mb-3 float-end"}>Submit All</button>
            </form>
        </div>
    );
}

export default Home;
