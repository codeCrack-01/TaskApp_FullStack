import axios from 'axios';

function AddTask (props) {

    const { formData, setFormData, status, refreshTable } = props;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/add', formData);
            refreshTable();  // Refresh the table after adding a task
            console.log("Response from Flask: ", response.data);
            // Optionally, clear the form after submission
            setFormData({
                title: '',
                description: '',
                status: status[0]?.value || ''
            });
        } catch (error) {
            console.error("Error sending data: ", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Add Tasks</legend>
                <input type='text' name='title' placeholder="Task Title" value={formData.title} onChange={handleChange} />
                <input type='text' name='description' placeholder='Description' value={formData.description} onChange={handleChange} />
                <select name='status' value={formData.status} onChange={handleChange}> 
                    {status.map(status => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
                <input type="submit" value="Add" />
            </fieldset>
        </form>
    )
}

export default AddTask;
