import axios from "axios";

function ExtraFunc ({ refreshTable }) {

    const deleteAll = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/deleteAll')
            refreshTable();  // Refresh the table
            console.log("Response from Flask: ", response.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <form onSubmit={deleteAll}>
                <fieldset>
                    <legend>Clear All Tasks</legend>
                    <input type="submit" value='Clear All' />
                </fieldset>
            </form>
        </>
    );
}

export default ExtraFunc;