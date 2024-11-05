import React, {useEffect, useState} from "react";
import axios from "axios";


function History() {
    const [professors, setProfessors] = useState([])
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/professors`)
            .then(response => {
                setProfessors(response.data);
            })
            .catch(error => console.error('Error fetching professor:', error));
    }, []);

    const handleSubmit = (e, id) => {
        e.preventDefault();
        axios.post(`${apiUrl}/download-all`, {id})
            .then(() => console.log('Absence data updated successfully'))
            .catch(error => console.error('Error updating absence:', error));
    }

    const handleDownload = async (e) => {
        e.preventDefault(); // Prevents page refresh

        const form = e.target;
        const id = form.getAttribute('data-id');
        const nom = form.getAttribute('data-nom');
        const prenom = form.getAttribute('data-prenom');

        try {
            const response = await axios.post(`${apiUrl}/download-all`, {id: id}, {
                responseType: 'blob', // Important to set the response type to 'blob'
            });

            // Create a link element to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${nom} ${prenom}.zip`); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.remove(); // Clean up the link element
        } catch (error) {
            console.error('Error downloading the zip file', error);
        }
    }

    return (
        <table className='table table-striped table-hover'>
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Number of Listes</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            {professors.map(professor => (
                <tr key={professor.id}>
                    <th className="align-middle">{professor.id}</th>
                    <td className="align-middle">{professor.nom}</td>
                    <td className="align-middle">{professor.prenom}</td>
                    <td className="align-middle ">{professor.count}</td>
                    <td className="d-flex align-items-center">
                        <a className="btn btn-success me-2" href={`/lists/${professor.id}`}>View</a>
                        <form data-id={professor.id}
                              data-nom={professor.nom}
                              data-prenom={professor.prenom}
                              onSubmit={handleDownload}>
                            <button
                                className="btn btn-warning me-2"
                            >
                                Download All
                            </button>
                        </form>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>);
}

export default History;