import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTask from './AddTask';
import './static/main.css';
import DeleteTask from './DeleteTask';
import ExtraFunc from './ExtraFunc';
import UpdateTask from './UpdateTask';

function Main() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: ''
    });

    const [status, setStatus] = useState([]);
    const [tableData, setTableData] = useState([]);

    const fetchStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/statusOptions');
            setStatus(response.data);
            setFormData(formData => ({ ...formData, status: response.data[0]?.value || '' }));
        } catch (error) {
            console.error('Error fetching status_options: ', error);
        }
    };

    const fetchTableData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/getTasks');
            setTableData(response.data);
        } catch (error) {
            console.error("Error fetching table data: ", error);
        }
    };

    useEffect(() => {
        fetchStatus();
        fetchTableData();
    }, []);

    return (
        <section>
            <p>This is the Main Content</p>
            <br />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                            <td>{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr/>

            <br/>
            <AddTask formData={formData} setFormData={setFormData} status={status} refreshTable={fetchTableData} />
            <br/>
            <DeleteTask refreshTable={fetchTableData} />
            <br />
            <UpdateTask status={status} refreshTable={fetchTableData} />
            <br />
            <ExtraFunc refreshTable={fetchTableData} />
        </section>
    );
}

export default Main;
