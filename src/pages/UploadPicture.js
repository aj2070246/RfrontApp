import React, { useState } from 'react';
import { uploadProfilePicture } from '../api'; // اطمینان حاصل کنید که مسیر درست است

const ProfilePictureUpload = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            console.log("✅ File selected:", selectedFile.name); // نمایش نام فایل برای تست
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // پاک کردن خطاها قبل از ارسال مجدد

        const currentUserId = localStorage.getItem('userId'); // دریافت userId
        console.log("🔹 currentUserId:", currentUserId);

        if (!file) {
            setError('Please select a file.');
            return;
        }

        try {
            const response = await uploadProfilePicture(file, currentUserId);
            console.log("✅ Upload Response:", response);
            alert('Upload successful!');
        } catch (error) {
            console.error('❌ Upload failed:', error);
            setError('Upload failed! Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>آپلود تصویر پروفایل</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.fileInputLabel}>
                    انتخاب فایل
                    <input type="file" onChange={handleFileChange} style={styles.fileInput} />
                </label>
                <button type="submit" style={styles.button}>ذخیره</button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        textAlign: 'center',
        fontFamily: "'Vazir', sans-serif",
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
    },
    fileInputLabel: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'inline-block',
        transition: '0.3s',
    },
    fileInput: {
        display: 'none', // مخفی کردن ورودی پیش‌فرض
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: '0.3s',
        fontFamily: "'Vazir', sans-serif",
    },
    buttonHover: {
        backgroundColor: '#218838',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginTop: '10px',
    },
};

export default ProfilePictureUpload;
