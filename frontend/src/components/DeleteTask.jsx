import React, { useState } from "react";
import axios from "axios";

function DeleteTask({ refreshTable }) {
    
    const [formData, setFormData] = useState ({
        id: '',
        title: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/delete', formData)
            refreshTable();  // Refresh the table after deleting a task
            console.log("Response from Flask: ", response.data)
        } catch (error) {
            console.error(error)
        }
    }
    
    const handleChange = (e) => {
        const{name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Delete Task</legend>
                    <input type='text' name='id' placeholder="Task ID" onChange={handleChange}/>
                    <input type='text' name='title' placeholder="Task Title" onChange={handleChange}/>
                    <input type='submit' value='Delete' />
                </fieldset>
            </form>
        </>
    );
}

export default DeleteTask;