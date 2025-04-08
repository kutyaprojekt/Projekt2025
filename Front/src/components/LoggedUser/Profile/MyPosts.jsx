import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaList } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const MyPosts = () => {
    const { theme } = useTheme();
    const [posts, setPosts] = useState([]);
    const [isAddingPost, setIsAddingPost] = useState(false);
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        status: 'active'
    });

    useEffect(() => {
        // TODO: Fetch posts from API
        // This is just mock data for now
        setPosts([
            {
                id: 1,
                title: 'Elveszett kutya',
                description: 'Fekete keverék kutya eltűnt a környékről',
                location: 'Budapest, 8. kerület',
                date: '2024-03-15',
                status: 'active'
            }
        ]);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Submit to API
        if (isEditingPost) {
            setPosts(posts.map(post => 
                post.id === currentPost.id ? { ...post, ...formData } : post
            ));
        } else {
            setPosts([...posts, { id: Date.now(), ...formData }]);
        }
        setIsAddingPost(false);
        setIsEditingPost(false);
        setCurrentPost(null);
        setFormData({
            title: '',
            description: '',
            location: '',
            date: '',
            status: 'active'
        });
    };

    const handleEdit = (post) => {
        setCurrentPost(post);
        setFormData(post);
        setIsEditingPost(true);
        setIsAddingPost(true);
    };

    const handleDelete = (id) => {
        // TODO: Delete from API
        setPosts(posts.filter(post => post.id !== id));
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 md:p-8`}>
                    <div className="flex items-center justify-between mb-6 md:mb-10">
                        <h2 className={`text-xl md:text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                            <FaList className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#1A73E8]" />
                            Posztjaim
                        </h2>
                        <button
                            onClick={() => setIsAddingPost(true)}
                            className={`flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-medium transition-colors ${
                                theme === 'dark' 
                                    ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white' 
                                    : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                            }`}
                        >
                            <FaPlus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            Új poszt
                        </button>
                    </div>

                    {isAddingPost && (
                        <div className={`mb-8 p-4 md:p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                {isEditingPost ? 'Poszt szerkesztése' : 'Új poszt létrehozása'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Cím
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                            theme === 'dark' 
                                                ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                                : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                        }`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Leírás
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                            theme === 'dark' 
                                                ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                                : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                        }`}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="location" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Helyszín
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                                theme === 'dark' 
                                                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                                    : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                            }`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="date" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Dátum
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                                theme === 'dark' 
                                                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                                    : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                            }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="status" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Állapot
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                            theme === 'dark' 
                                                ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                                : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                        }`}
                                        required
                                    >
                                        <option value="active">Aktív</option>
                                        <option value="inactive">Inaktív</option>
                                        <option value="solved">Megoldva</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row gap-3">
                                    <button
                                        type="submit"
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                            theme === 'dark' 
                                                ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white' 
                                                : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                        }`}
                                    >
                                        {isEditingPost ? 'Mentés' : 'Létrehozás'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingPost(false);
                                            setIsEditingPost(false);
                                            setCurrentPost(null);
                                            setFormData({
                                                title: '',
                                                description: '',
                                                location: '',
                                                date: '',
                                                status: 'active'
                                            });
                                        }}
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                            theme === 'dark' 
                                                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                                        }`}
                                    >
                                        Mégse
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                        {post.title}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                theme === 'dark' 
                                                    ? 'text-blue-400 hover:bg-gray-600' 
                                                    : 'text-blue-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <FaEdit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                theme === 'dark' 
                                                    ? 'text-red-400 hover:bg-gray-600' 
                                                    : 'text-red-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="font-medium">Leírás:</span> {post.description}
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="font-medium">Helyszín:</span> {post.location}
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="font-medium">Dátum:</span> {post.date}
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="font-medium">Állapot:</span> {post.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPosts; 