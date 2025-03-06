import React, { useState } from 'react';
import { uploadProfilePicture } from '../api'; // اطمینان حاصل کنید که مسیر درست است

const ProfilePictureUpload = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError("❌ فقط فرمت‌های JPG, PNG و WEBP مجاز است.");
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("❌ حداکثر حجم مجاز ۵ مگابایت است.");
                return;
            }
        }

        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const currentUserId = localStorage.getItem('userId');

        if (!currentUserId) {
            setError('خطا: شناسه کاربر یافت نشد!');
            return;
        }

        if (!file) {
            setError('لطفا یک فایل انتخاب نمایید');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("File", file);
            formData.append("CurrentUserId", localStorage.getItem("userId"));

            const response = await uploadProfilePicture(formData);

            if (response.isSuccess) {
            } else {
                setError(`❌ ${response.message}`);
            }
        } catch {
            setError("❌ خطای غیرمنتظره‌ای رخ داد");
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
        display: 'none',
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
    error: {
        color: 'red',
        fontSize: '14px',
        marginTop: '10px',
    },
};

export default ProfilePictureUpload;
