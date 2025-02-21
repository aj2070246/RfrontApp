import React, { useState } from 'react';
import { uploadProfilePicture } from '../api'; // مطمئن شوید که مسیر صحیح را استفاده می‌کنید

const ProfilePictureUpload = () => {
    const [file, setFile] = useState(null);
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // خطاها را قبل از ارسال مجدد پاک کنید
        const currentUserId = localStorage.getItem('userId'); // دریافت توکن

        // بررسی وجود فایل و userId
        if (!file || !currentUserId) {
            setError('Please provide both a user ID and a file.');
            return;
        }

        try {
            const response = await uploadProfilePicture(file, currentUserId);
            console.log(response); // نمایش پاسخ از سرور
            alert('Upload successful!');
        } catch (error) {
            console.error('Upload failed:', error);
            setError('Upload failed! Please try again.'); // پیام خطا
        }
    };

    return (
        <div>
            <h2>Upload Profile Picture</h2>
            <form onSubmit={handleSubmit}>
                
                <input
                    type="file"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit">Upload</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* نمایش خطا */}
        </div>
    );
};

export default ProfilePictureUpload;
