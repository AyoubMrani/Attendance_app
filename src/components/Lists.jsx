import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from 'react-router-dom';
import Swal from "sweetalert2";

function Lists() {
    const [data, setData] = useState([]);
    const {id} = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/lists/${id}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page refresh
        const element = e.target.getAttribute('data-element');
        try {
            const response = await axios.post(`${apiUrl}/download`, {id: id, element: element}, {
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
    return (
        <div>
            <h1>Listes</h1>
            <table className='table table-striped table-hover'>
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                {data.map((element, key) => (
                    <tr key={key}>
                        <th className="align-middle">{key + 1}</th>
                        <th className="align-middle">{element}</th>
                        <td className="d-flex align-items-center">
                            <a className="btn btn-success me-2"
                               href={`/edit-absence/${id}/${element.replace(".json", "")}`}>View</a>
                            <form
                                data-id={id}
                                data-element={element}
                                onSubmit={handleSubmit}>
                                <button
                                    className="btn btn-primary me-2"
                                    type={"submit"}
                                >
                                    Download
                                </button>
                            </form>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Lists;