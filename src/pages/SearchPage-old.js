
import React, { useState, useEffect, useRef } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { searchUsers, getDropdownItems, getUserProfilePhoto } from '../api'; // اضافه کردن متد جدید
import {
    AgeFromDropdown, AgeToDropdown, ProvinceDropdown,
    HealtStatusDropdown, LiveTypeDropdown, MarriageStatusDropdown,
    CarValuesDropdown,
    HomeValueDropDown,
    IncomeAmountDropDown,
    OnlineStatusDropDown,
    ProfilePhotoStatusDropDown,
    RelationTypeDropDown
} from './registerPage/Dropdowns';

const SearchPage2 = () => {
    const defaultAvatar = process.env.PUBLIC_URL + "/pictures/default-avatar.png";

    const [ageFrom, setAgeFrom] = useState('');
    const [ageTo, setAgeTo] = useState('');
    const [location, setLocation] = useState('');
    const [healthStatus, setHealthStatus] = useState('');
    const [liveType, setLiveType] = useState('');
    const [marriageStatus, setMarriageStatus] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const [incomeAmount, setIncomeAmount] = useState('');
    const [homeValue, setHomeValue] = useState('');
    const [carValue, setCarValue] = useState('');
    const [onlineStatus, setOnlineStatus] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [relationType, setRelationType] = useState('');

    const [formData, setFormData] = useState({
        ageFrom: '',
        ageTo: '',
        province: '',
        healtStatus: '',
        liveType: '',
        marriageStatus: '',
        incomeAmount: '',
        homeValue: '',
        carValue: '',
        onlineStatus: '',
        profilePhoto: '',
        relationType: ''
    });
    const [dropdownVisible, setDropdownVisible] = useState(true);

    // اضافه کردن state برای ذخیره داده‌های دراپ‌داون‌ها
    const [dropdownData, setDropdownData] = useState({
        ageTo: [],
        ageFrom: [],
        healtStatus: [],
        liveTypes: [],
        marriageStatus: [],
        provinces: [],
        incomeAmount: [],
        homeValue: [],
        carValue: [],
        onlineStatus: [],
        profilePhoto: [],
        relationType: []
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const dropdownResponse = await getDropdownItems();
                if (dropdownResponse.data.isSuccess) {
                    setDropdownData({
                        ageFrom: dropdownResponse.data.model.ages || [],
                        ageTo: dropdownResponse.data.model.ages || [],
                        healtStatus: dropdownResponse.data.model.healtStatus || [],
                        liveTypes: dropdownResponse.data.model.liveTypes || [],
                        marriageStatus: dropdownResponse.data.model.marriageStatus || [],
                        provinces: dropdownResponse.data.model.provinces || [],
                        incomeAmount: dropdownResponse.data.model.incomeAmount || [],
                        carValue: dropdownResponse.data.model.carValue || [],
                        homeValue: dropdownResponse.data.model.homeValue || [],
                        onlineStatus: dropdownResponse.data.model.onlineStatus || [],
                        profilePhoto: dropdownResponse.data.model.profilePhoto || [],
                        relationType: dropdownResponse.data.model.relationType || [],
                    });
                }
            } catch (error) {
                console.error('❌ Error fetching dropdown data:', error);
            } finally {
            }
        };

        fetchData();
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSearch = async () => {
        setDropdownVisible(false); // بستن دراپ‌دان‌ها پس از جستجو

        try {
            setError(null); // پاک کردن خطا قبل از جستجو

            // ساخت داده‌ها بر اساس مقادیر انتخابی و تبدیل رشته به id
            const requestData = {
                pageIndex: pageIndex + 1,
                pageItemsCount: 10,
                ageIdFrom: formData.ageFrom ? parseInt(formData.ageFrom) : 0,
                ageIdTo: formData.ageTo ? parseInt(formData.ageTo) : 0,
                CurrentUserId: localStorage.getItem('userId'),
                healthStatusId: formData.healtStatus ? parseInt(formData.healtStatus) : 0,
                liveTypeId: formData.liveType ? parseInt(formData.liveType) : 0,
                marriageStatusId: formData.marriageStatus ? parseInt(formData.marriageStatus) : 0,
                provinceId: formData.province ? parseInt(formData.province) : 0,
                incomeId: formData.incomeAmount ? parseInt(formData.incomeAmount) : 0,
                carValueId: formData.carValue ? parseInt(formData.carValue) : 0,
                homeValueId: formData.homeValue ? parseInt(formData.homeValue) : 0,
                profilePhotoId: formData.profilePhoto ? parseInt(formData.profilePhoto) : 0,
                onlineStatusId: formData.onlineStatus ? parseInt(formData.onlineStatus) : 0,
                relationTypeId: formData.relationType ? parseInt(formData.relationType) : 0,
            };

            // فراخوانی تابع searchUsers با ارسال requestData
            const response = await searchUsers(requestData);

            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message || 'خطایی رخ داده است');
            }

            setResults(response.data.model || []); // ذخیره داده‌ها
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchMoreResults = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const requestData = {
                pageIndex: pageIndex + 1,
                pageItemsCount: 10,
                ageIdFrom: formData.ageFrom ? parseInt(formData.ageFrom) : 0,
                ageIdTo: formData.ageTo ? parseInt(formData.ageTo) : 0,
                CurrentUserId: localStorage.getItem('userId'),
                healthStatusId: formData.healtStatus ? parseInt(formData.healtStatus) : 0,
                liveTypeId: formData.liveType ? parseInt(formData.liveType) : 0,
                marriageStatusId: formData.marriageStatus ? parseInt(formData.marriageStatus) : 0,
                provinceId: formData.province ? parseInt(formData.province) : 0,
                incomeId: formData.incomeAmount ? parseInt(formData.incomeAmount) : 0,
                carValueId: formData.carValue ? parseInt(formData.carValue) : 0,
                homeValueId: formData.homeValue ? parseInt(formData.homeValue) : 0,
                profilePhotoId: formData.profilePhoto ? parseInt(formData.profilePhoto) : 0,
                onlineStatusId: formData.onlineStatus ? parseInt(formData.onlineStatus) : 0,
                relationTypeId: formData.relationType ? parseInt(formData.relationType) : 0,
            };

            const response = await searchUsers(requestData);
            if (response.data.statusCode === 200) {
                setResults((prev) => [...prev, ...response.data.model]);
                setPageIndex((prev) => prev + 1);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchMoreResults();
            }
        });
        if (observer.current && document.getElementById('scroll-end')) {
            observer.current.observe(document.getElementById('scroll-end'));
        }
        return () => observer.current && observer.current.disconnect();
    }, [results]);


    return (
        <Box sx={{ padding: 2 }} dir="rtl">
            <h2 style={{ textAlign: 'center' }}>جستجوی کاربران</h2>
            {!dropdownVisible && (

                <Box
                    sx={{
                        backgroundColor: "#ddd",
                        padding: "10px",
                        textAlign: "center",
                        cursor: "pointer",
                        marginTop: "10px",
                        borderRadius: "5px"
                    }}
                    onClick={() => setDropdownVisible(prev => !prev)}
                >
                    {dropdownVisible ? "بستن فیلترها ❌" : "نمایش فیلترها 🔍"}
                </Box>

            )}

            {dropdownVisible && (

                <Grid container spacing={2}>
                    <AgeToDropdown ageRange={formData.ageTo} handleChange={handleChange} ages={dropdownData.ageTo} />
                    <AgeFromDropdown ageRange={formData.ageFrom} handleChange={handleChange} ages={dropdownData.ageFrom} />
                    <ProvinceDropdown province={formData.province} handleChange={handleChange} provinces={dropdownData.provinces} />
                    <HealtStatusDropdown healtStatus={formData.healtStatus} handleChange={handleChange} healtStatusOptions={dropdownData.healtStatus} />
                    <LiveTypeDropdown liveType={formData.liveType} handleChange={handleChange} liveTypes={dropdownData.liveTypes} />
                    <MarriageStatusDropdown marriageStatus={formData.marriageStatus} handleChange={handleChange} marriageStatusOptions={dropdownData.marriageStatus} />
                    <RelationTypeDropDown relationType={formData.relationType} handleChange={handleChange} onlineStatuss={dropdownData.relationType} />

                    <HomeValueDropDown homeValue={formData.homeValue} handleChange={handleChange} homeValues={dropdownData.homeValue} />
                    <CarValuesDropdown carValue={formData.carValue} handleChange={handleChange} carValueOptions={dropdownData.carValue} />
                    <IncomeAmountDropDown incomeAmount={formData.incomeAmount} handleChange={handleChange} incomeAmounts={dropdownData.incomeAmount} />
                    <ProfilePhotoStatusDropDown profilePhotoStatus={formData.profilePhoto} handleChange={handleChange} profilePhotoStatuss={dropdownData.profilePhoto} />
                    <OnlineStatusDropDown onlineStatus={formData.onlineStatus} handleChange={handleChange} onlineStatuss={dropdownData.onlineStatus} />
                </Grid>
            )}
            <Grid container spacing={2}>

                {/* دکمه جستجو */}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                        جستجو
                    </Button>
                </Grid>

                {/* نمایش خطا */}
                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                )}

                {/* نمایش نتایج جستجو */}
                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                    {results.length > 0 ? (
                        results.map((user) => (
                            <Grid item xs={12} sm={6} md={3} key={user.id}>
                                <Card sx={{ margin: 1, bgcolor: "rgb(255, 0, 251)" }}> {/* رنگ پس‌زمینه کارد */}
                                    <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
                                        <CardActionArea>
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    height: 140, // ارتفاع ثابت
                                                    width: "100%", // پر کردن عرض کارت
                                                    backgroundColor: "pink", // رنگ پس‌زمینه قرمز
                                                    overflow: "hidden", // جلوگیری از نمایش اضافی
                                                }}
                                            >

                                                <CardMedia
                                                    component="img"
                                                    //   image={`http://localhost:5000/connection/downloadProfilePhoto?userId=${user.id}`}
                                                    image={getUserProfilePhoto(user.id)}
                                                    alt="User Avatar"
                                                    onError={(e) => {
                                                        e.target.onerror = null; // جلوگیری از حلقه بی‌پایان
                                                        e.target.src = defaultAvatar; // نمایش عکس پیش‌فرض
                                                    }}
                                                    sx={{
                                                        height: "100%", // پر کردن ارتفاع
                                                        width: "100%", // پر کردن عرض کارت
                                                        objectFit: "contain", // برش تصویر در صورت نیاز
                                                        position: "absolute", // قرارگیری در بالای Box
                                                        top: 0,
                                                        left: 0,
                                                    }}
                                                />
                                            </Box>
                                        </CardActionArea>
                                    </Link>
                                    <CardContent>
                                        <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
                                            <Typography variant="h6">
                                                {user.firstName} {user.lastName}
                                                <br />    {user.age} {" "} ساله از  {" "}{user.province}
                                            </Typography>
                                        </Link>

                                        {user.marriageStatus}{" - "}{user.liveType}



                                        <Typography variant="body2" color="textSecondary">
                                            میزان درآمد    {user.incomeAmount}
                                            <br />
                                            نوع رابطه مورد نظر  :  {user.relationType}
                                            <br />
                                            آخرین فعالیت  {user.lastActivityDate}
                                        </Typography>
                                        <Link to={`/chat/${user.id}`}>
                                            <Button variant="contained" color="primary" sx={{ mt: 3 }} fullWidth>
                                                شروع گفتگو
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" textAlign="center">
                                هیچ نتیجه‌ای برای جستجوی شما پیدا نشد.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <div id="scroll-end" style={{ height: 10 }}></div>
            {loading && <Typography textAlign="center">در حال بارگذاری...</Typography>}
        </Box>
    );



};

export default SearchPage2;
