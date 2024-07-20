import React, { useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import './css/style.css'; // Import custom CSS for additional styling
import { Link } from 'react-router-dom';

const ApplyToBeADoctorBody = () => {
    const { user, loading } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        // Check if a file is selected
        if (selectedFile) {
            // Check file type
            if (selectedFile.type !== 'application/pdf') {
                setError('Please select a PDF file.');
            } else {
                setFile(selectedFile);
                setError(null);
            }
        } else {
            setError('Please select a file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fileUpload', file);
        formData.append('userId',user.id);
        try {
            const response = await fetch('http://localhost:5000/api/users/applytobeadoctor', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            const data = await response.json();
            console.log('File uploaded successfully:', data);
            // Handle success (e.g., show success message)
        } catch (error) {
            console.error('Error uploading file:', error.message);
            // Handle error (e.g., show error message)
        }
    };

    if (!user) {
        return (
            <div className="container-fluid py-5 bg-light text-center">
                <h2 className="mb-4">SympDoctor Dashboard</h2>
                <p>Loading user data...</p>
                {/* You can add a spinner or loading indicator here */}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container-fluid py-5 bg-light text-center">
                <h2 className="mb-4">Choose your symptoms</h2>
                <p>Loading disease data...</p>
                {/* You can add a spinner or loading indicator here */}
            </div>
        );
    }

    return (
        <div id="page-inner">

        <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
        <div className="row">

        <div className="container-fluid py-5 bg-light">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h2 className="mb-4 text-center">Apply to be a Doctor</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fileUpload" className="mb-2">Upload Documents</label>
                                <input
                                    type="file"
                                    className="form-control-file custom-file-input"
                                    id="fileUpload"
                                    name="fileUpload"
                                    onChange={handleChange}
                                />
                                {error && <div className="text-danger mt-2">{error}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary btn-block mt-4" disabled={!file}>
                                Submit
                            </button>
                        </form>
                    </div>
                    <Link   to="/dashboard/apply/view"> View your old requests </Link>
                </div>
            </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default ApplyToBeADoctorBody;
