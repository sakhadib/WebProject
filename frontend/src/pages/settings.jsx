import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Settings() {
    const navigate = useNavigate();
    const { user: authUser, refreshUser } = useAuth();
    const [loading, setLoading] = useState(!authUser); // Start with false if we have authUser
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    
    // Helper function to get full avatar URL
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return null;
        if (avatarPath.startsWith('http')) return avatarPath;
        return `http://127.0.0.1:5050/storage/${avatarPath}`;
    };
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        email: '',
        username: ''
    });
    
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch current user data
    useEffect(() => {
        console.log(authUser);
        
        const loadUserData = () => {
            if (authUser) {
                setFormData({
                    first_name: authUser.first_name || '',
                    last_name: authUser.last_name || '',
                    bio: authUser.bio || '',
                    email: authUser.email || '',
                    username: authUser.username || ''
                });
                
                if (authUser.avatar) {
                    setAvatarPreview(getAvatarUrl(authUser.avatar));
                }
                
                setLoading(false);
            } else {
                // If no auth user, try to fetch from API
                const fetchUserData = async () => {
                    try {
                        setLoading(true);
                        const response = await api.post('/auth/me');
                        const userData = response.data;
                        console.log(userData);
                        
                        
                        setFormData({
                            first_name: userData.first_name || '',
                            last_name: userData.last_name || '',
                            bio: userData.bio || '',
                            email: userData.email || '',
                            username: userData.username || ''
                        });
                        
                        if (userData.avatar) {
                            setAvatarPreview(getAvatarUrl(userData.avatar));
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                        setErrors({ general: 'Failed to load user data' });
                    } finally {
                        setLoading(false);
                    }
                };
                
                fetchUserData();
            }
        };

        loadUserData();
    }, [authUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }));
                return;
            }
            
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, avatar: 'File size must be less than 2MB' }));
                return;
            }
            
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, avatar: '' }));
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatar) return;

        try {
            setUploadingAvatar(true);
            setErrors(prev => ({ ...prev, avatar: '' }));

            const formData = new FormData();
            formData.append('avatar', avatar);

            await api.post('/user/update-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccessMessage('Profile picture updated successfully!');
            setAvatar(null);
            
            // Refresh auth user data and update avatar preview
            if (refreshUser) {
                const updatedUser = await refreshUser();
                if (updatedUser?.avatar) {
                    setAvatarPreview(getAvatarUrl(updatedUser.avatar));
                }
                // Update localStorage with new user data
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                setErrors(prev => ({ ...prev, avatar: errorMessages.join(', ') }));
            } else {
                setErrors(prev => ({ ...prev, avatar: 'Failed to update profile picture' }));
            }
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            setErrors({});
            setSuccessMessage('');

            await api.post('/user/update-profile', {
                first_name: formData.first_name,
                last_name: formData.last_name,
                bio: formData.bio
            });

            setSuccessMessage('Profile updated successfully!');
            
            // Refresh auth user data and update form
            if (refreshUser) {
                const updatedUser = await refreshUser();
                if (updatedUser) {
                    setFormData(prev => ({
                        ...prev,
                        first_name: updatedUser.first_name || '',
                        last_name: updatedUser.last_name || '',
                        bio: updatedUser.bio || ''
                    }));
                    // Update localStorage with new user data
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
            }
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Failed to update profile. Please try again.' });
            }
        } finally {
            setSaving(false);
        }
    };

    const removeAvatarPreview = () => {
        setAvatar(null);
        // Reset to current user's avatar or fallback
        if (authUser?.avatar) {
            setAvatarPreview(getAvatarUrl(authUser.avatar));
        } else {
            setAvatarPreview(null);
        }
        setErrors(prev => ({ ...prev, avatar: '' }));
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-16 bg-gray-200 rounded"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                    </div>
                    <button
                        onClick={() => navigate(`/profile/${formData.username}`)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                    </button>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="ml-3 text-sm text-green-700">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* General Error */}
            {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="ml-3 text-sm text-red-700">{errors.general}</p>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {/* Profile Picture Section */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>
                        <p className="text-sm text-gray-500">Update your profile picture</p>
                    </div>
                    <div className="px-6 py-6">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img
                                    src={avatarPreview || `https://ui-avatars.com/api/?name=${formData.username || 'User'}&background=random&size=80`}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${formData.username || 'User'}&background=random&size=80`;
                                    }}
                                />
                                {uploadingAvatar && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <label
                                        htmlFor="avatar-upload"
                                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Choose Photo
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        disabled={uploadingAvatar}
                                    />
                                    {avatar && (
                                        <>
                                            <button
                                                onClick={handleAvatarUpload}
                                                disabled={uploadingAvatar}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {uploadingAvatar ? 'Uploading...' : 'Upload'}
                                            </button>
                                            <button
                                                onClick={removeAvatarPreview}
                                                disabled={uploadingAvatar}
                                                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    JPG, PNG, GIF up to 2MB
                                </p>
                                {errors.avatar && (
                                    <p className="text-sm text-red-600 mt-2">{errors.avatar}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information Section */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                        <p className="text-sm text-gray-500">Update your personal information</p>
                    </div>
                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                        {/* Account Information (Read-only) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>
                        </div>

                        {/* Editable Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter your first name"
                                />
                                {errors.first_name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.first_name[0]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter your last name"
                                />
                                {errors.last_name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.last_name[0]}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                placeholder="Tell us about yourself..."
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.bio && (
                                    <p className="text-sm text-red-600">{errors.bio[0]}</p>
                                )}
                                <p className="text-xs text-gray-500 ml-auto">
                                    {formData.bio.length}/500 characters
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
