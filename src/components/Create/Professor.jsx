import React, {useState} from 'react';
import axios from "axios";
import Swal from "sweetalert2";

function CreateProfessor() {

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value.toUpperCase());
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value.toUpperCase());
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${apiUrl}/create/professor`, {FirstName, LastName})
            .then(() => {
                Swal.fire({
                    title: "Professor submitted successfully",
                    icon: "success",
                    timer: 5000,
                    timerProgressBar: true,
                })
                setFirstName('');
                setLastName('');
                document.getElementById('FirstName').value = '';
                document.getElementById('LastName').value = '';
            })
            .catch(error => {
                Swal.fire({
                    title: "Error submitting list",
                    icon: "error",
                    timer: 5000,
                    timerProgressBar: true,
                });
            });
    };

    return (
        <div>
            <h1>Create Professor</h1>
            <div className="m-5">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-center">
                        <label htmlFor="professorFirstName" className="form-label">First Name:</label>
                        <div className="row justify-content-center">
                            <div className="col-md-4">
                                <input
                                    onChange={(e)=>handleFirstNameChange(e)}
                                    name={"FirstName"}
                                    id={"FirstName"}
                                    type="text"
                                    className="form-control form-control-sm"
                                    required={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 text-center">
                        <label htmlFor="professorLastName" className="form-label">Last Name :</label>
                        <div className="row justify-content-center">
                            <div className="col-md-4">
                                <input
                                    onChange={(e)=>handleLastNameChange(e)}
                                    name={"LastName"}
                                    id={"LastName"}
                                    type="text"
                                    className="form-control form-control-sm"
                                    required={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProfessor;
