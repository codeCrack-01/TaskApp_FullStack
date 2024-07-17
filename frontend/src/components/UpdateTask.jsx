import axios from "axios";

function UpdateTask(props) {
    const { status, refreshTable } = props;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post('http://localhost:5000/api/updateTask', data);
            refreshTable();  // Refresh the table after updating a task
            console.log("Response from Flask: ", response.data);
        } catch (error) {
            console.error("Error sending data: ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Update Status</legend>

                <fieldset>
                    <input
                        type="text"
                        name="task_id"
                        placeholder="Task ID"
                    />
                    <p>OR</p>
                    <input
                        type="text"
                        name="task_title"
                        placeholder="Task Title"
                    />
                </fieldset>
                <fieldset>
                    <select
                        name="status"
                    >
                        {status.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                    <input type="submit" value="Update" />
                </fieldset>
            </fieldset>
        </form>
    );
}

export default UpdateTask;
