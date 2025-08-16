import { useState, useRef, useEffect } from 'react';

export default function TestCreate() {
    const [title, setTitle] = useState('');
    const [chunks, setChunks] = useState([
        { serial: 2, style: 'text', content: 'Start writing your blog post here...' }
    ]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [showStylePopup, setShowStylePopup] = useState(null);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishData, setPublishData] = useState({
        topics: [],
        topicInput: '',
        publication: '',
        featuredImage: null,
        category: ''
    });
    const dragCounter = useRef(0);

    // Handle clicking outside to close popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showStylePopup !== null) {
                // Check if click is outside the popup
                const popupElement = event.target.closest('.style-popup');
                const buttonElement = event.target.closest('.three-dots-button');
                
                if (!popupElement && !buttonElement) {
                    setShowStylePopup(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showStylePopup]);

    const styles = {
        "h1": "text-3xl font-bold mb-6",
        "h2": "text-2xl font-bold mb-4",
        "h3": "text-xl font-bold mb-2",
        "h4": "text-lg font-bold mb-1",
        "text": "text-base mb-4",
        "quote": "border-l-4 border-gray-300 pl-4 italic mb-4",
        "code": "bg-gray-100 p-2 rounded font-mono mb-4",
        "bullet": "list-disc list-inside pl-4 mb-4",
        "enumerate": "list-decimal list-inside pl-4 mb-4",
        "image": "my-4",
        "caption": "text-sm text-gray-500 italic mb-2"
    };

    const styleOptions = [
        { value: 'h1', label: 'Heading 1' },
        { value: 'h2', label: 'Heading 2' },
        { value: 'h3', label: 'Heading 3' },
        { value: 'h4', label: 'Heading 4' },
        { value: 'text', label: 'Text' },
        { value: 'quote', label: 'Quote' },
        { value: 'code', label: 'Code' },
        { value: 'bullet', label: 'Bullet List' },
        { value: 'enumerate', label: 'Numbered List' },
        { value: 'caption', label: 'Caption' }
    ];

    // Mock data for dropdowns
    const publications = [
        { id: 1, name: 'Tech Today' },
        { id: 2, name: 'Code Chronicles' },
        { id: 3, name: 'Digital Insights' },
        { id: 4, name: 'Innovation Weekly' }
    ];

    const categories = [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Programming' },
        { id: 3, name: 'Web Development' },
        { id: 4, name: 'AI & Machine Learning' },
        { id: 5, name: 'Mobile Development' },
        { id: 6, name: 'DevOps' }
    ];

    // Suggested topics (would come from API in real app)
    const suggestedTopics = [
        'JavaScript', 'React', 'Node.js', 'Python', 'AI', 'Machine Learning',
        'Web Development', 'Mobile Apps', 'DevOps', 'Cloud Computing',
        'Blockchain', 'Cybersecurity', 'Data Science', 'UI/UX Design'
    ];

    // Update serials to maintain order
    const updateSerials = (newChunks) => {
        return newChunks.map((chunk, index) => ({
            ...chunk,
            serial: index + 1
        }));
    };

    // Add new chunk
    const addChunk = (index = chunks.length) => {
        const newChunk = {
            serial: index + 1,
            style: 'text',
            content: '',
            points: []
        };
        const newChunks = [...chunks];
        newChunks.splice(index, 0, newChunk);
        setChunks(updateSerials(newChunks));
    };

    // Delete chunk
    const deleteChunk = (index) => {
        const newChunks = chunks.filter((_, i) => i !== index);
        setChunks(updateSerials(newChunks));
    };

    // Update chunk content
    const updateChunk = (index, field, value) => {
        const newChunks = [...chunks];
        newChunks[index] = { ...newChunks[index], [field]: value };
        
        // Reset points if style changes to non-list type
        if (field === 'style' && !['bullet', 'enumerate'].includes(value)) {
            newChunks[index].points = [];
        }
        // Initialize points for list types
        if (field === 'style' && ['bullet', 'enumerate'].includes(value) && !newChunks[index].points) {
            newChunks[index].points = [''];
        }
        
        setChunks(newChunks);
    };

    // Update list points
    const updatePoint = (chunkIndex, pointIndex, value) => {
        const newChunks = [...chunks];
        if (!newChunks[chunkIndex].points) {
            newChunks[chunkIndex].points = [];
        }
        newChunks[chunkIndex].points[pointIndex] = value;
        setChunks(newChunks);
    };

    // Add new point to list
    const addPoint = (chunkIndex) => {
        const newChunks = [...chunks];
        if (!newChunks[chunkIndex].points) {
            newChunks[chunkIndex].points = [];
        }
        newChunks[chunkIndex].points.push('');
        setChunks(newChunks);
    };

    // Remove point from list
    const removePoint = (chunkIndex, pointIndex) => {
        const newChunks = [...chunks];
        newChunks[chunkIndex].points.splice(pointIndex, 1);
        setChunks(newChunks);
    };

    // Drag and drop handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedIndex(null);
        dragCounter.current = 0;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        dragCounter.current++;
    };

    const handleDragLeave = () => {
        dragCounter.current--;
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        dragCounter.current = 0;
        
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newChunks = [...chunks];
        const draggedChunk = newChunks[draggedIndex];
        
        // Remove dragged item
        newChunks.splice(draggedIndex, 1);
        
        // Insert at new position
        const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
        newChunks.splice(insertIndex, 0, draggedChunk);
        
        setChunks(updateSerials(newChunks));
    };

    // Publish modal helper functions
    const addTopic = (topic) => {
        if (topic && !publishData.topics.includes(topic)) {
            setPublishData(prev => ({
                ...prev,
                topics: [...prev.topics, topic],
                topicInput: ''
            }));
        }
    };

    const removeTopic = (topicToRemove) => {
        setPublishData(prev => ({
            ...prev,
            topics: prev.topics.filter(topic => topic !== topicToRemove)
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPublishData(prev => ({
                ...prev,
                featuredImage: file
            }));
        }
    };

    const handleSaveDraft = () => {
        // TODO: Implement save draft functionality
        console.log('Saving draft...', { title, chunks });
        alert('Draft saved successfully!');
    };

    const handlePublish = () => {
        // TODO: Implement publish functionality
        console.log('Publishing...', { title, chunks, publishData });
        alert('Article published successfully!');
        setShowPublishModal(false);
    };

    // Render chunk content based on style with in-place editing
    const renderChunkContent = (chunk, index) => {
        const isListType = ['bullet', 'enumerate'].includes(chunk.style);
        
        if (isListType) {
            return (
                <div>
                    {/* List items */}
                    <div className="ml-6">
                        {(chunk.points || ['']).map((point, pointIndex) => (
                            <div key={pointIndex} className="flex items-start mb-1">
                                <span className={`mr-2 mt-1 ${chunk.style === 'bullet' ? 'text-lg leading-none' : 'text-sm'}`}>
                                    {chunk.style === 'bullet' ? '•' : `${pointIndex + 1}.`}
                                </span>
                                <textarea
                                    value={point}
                                    onChange={(e) => updatePoint(index, pointIndex, e.target.value)}
                                    placeholder="List item"
                                    className="flex-1 border-none outline-none bg-transparent resize-none"
                                    rows={1}
                                    style={{ minHeight: '24px' }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            addPoint(index);
                                            // Focus the new point after a short delay
                                            setTimeout(() => {
                                                const nextInput = e.target.parentElement.nextElementSibling?.querySelector('textarea');
                                                if (nextInput) {
                                                    nextInput.focus();
                                                }
                                            }, 10);
                                        }
                                        if (e.key === 'Backspace' && point === '' && chunk.points.length > 1) {
                                            e.preventDefault();
                                            removePoint(index, pointIndex);
                                            // Focus the previous point
                                            setTimeout(() => {
                                                const prevInput = e.target.parentElement.previousElementSibling?.querySelector('textarea');
                                                if (prevInput) {
                                                    prevInput.focus();
                                                    prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                                                }
                                            }, 10);
                                        }
                                        // If it's the only point and empty, delete the chunk
                                        if (e.key === 'Backspace' && point === '' && chunk.points.length === 1) {
                                            e.preventDefault();
                                            deleteChunk(index);
                                            // Focus the previous chunk
                                            setTimeout(() => {
                                                const prevChunk = document.querySelector(`[data-chunk-index="${index - 1}"] textarea`);
                                                if (prevChunk) {
                                                    prevChunk.focus();
                                                    prevChunk.setSelectionRange(prevChunk.value.length, prevChunk.value.length);
                                                }
                                            }, 10);
                                        }
                                    }}
                                    onInput={(e) => {
                                        // Auto-resize textarea
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                />
                                {chunk.points.length > 1 && (
                                    <button
                                        onClick={() => removePoint(index, pointIndex)}
                                        className="ml-2 text-red-500 hover:text-red-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                addPoint(index);
                                // Focus the new point after a short delay
                                setTimeout(() => {
                                    const listItems = document.querySelectorAll(`[data-chunk-index="${index}"] textarea`);
                                    const lastItem = listItems[listItems.length - 1];
                                    if (lastItem) {
                                        lastItem.focus();
                                    }
                                }, 10);
                            }}
                            className="text-blue-500 hover:text-blue-700 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            + Add item
                        </button>
                    </div>
                </div>
            );
        }

        // For non-list types, render styled content directly
        const getInputClassName = () => {
            const baseClasses = "w-full border-none outline-none bg-transparent resize-none";
            return `${baseClasses} ${styles[chunk.style]}`;
        };

        return (
            <textarea
                value={chunk.content}
                onChange={(e) => updateChunk(index, 'content', e.target.value)}
                placeholder={`Type your ${chunk.style === 'code' ? 'code' : chunk.style.startsWith('h') ? 'heading' : 'content'} here...`}
                className={getInputClassName()}
                rows={chunk.style.startsWith('h') ? 1 : 1}
                style={{ 
                    minHeight: chunk.style.startsWith('h') ? '40px' : '60px',
                    fontFamily: chunk.style === 'code' ? 'monospace' : 'inherit'
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addChunk(index + 1);
                        // Focus the new chunk after a short delay
                        setTimeout(() => {
                            const nextChunk = document.querySelector(`[data-chunk-index="${index + 1}"] textarea`);
                            if (nextChunk) {
                                nextChunk.focus();
                            }
                        }, 10);
                    }
                    if (e.key === 'Backspace' && chunk.content === '' && chunks.length > 1) {
                        e.preventDefault();
                        deleteChunk(index);
                        // Focus the previous chunk
                        setTimeout(() => {
                            const prevChunk = document.querySelector(`[data-chunk-index="${index - 1}"] textarea`);
                            if (prevChunk) {
                                prevChunk.focus();
                                prevChunk.setSelectionRange(prevChunk.value.length, prevChunk.value.length);
                            }
                        }, 10);
                    }
                }}
                onInput={(e) => {
                    // Auto-resize textarea for non-heading elements
                    if (!chunk.style.startsWith('h')) {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }
                }}
            />
        );
    };

    // Style popup component
    const StylePopup = ({ chunkIndex, onClose }) => {
        return (
            <div 
                className="style-popup absolute left-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-xs text-gray-500 mb-2 px-2">Turn into</div>
                {styleOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={(e) => {
                            e.stopPropagation();
                            updateChunk(chunkIndex, 'style', option.value);
                            onClose();
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center space-x-2"
                    >
                        <span className="text-gray-600 w-6">
                            {option.value === 'h1' && 'H₁'}
                            {option.value === 'h2' && 'H₂'}
                            {option.value === 'h3' && 'H₃'}
                            {option.value === 'h4' && 'H₄'}
                            {option.value === 'text' && 'T'}
                            {option.value === 'quote' && '"'}
                            {option.value === 'code' && '<>'}
                            {option.value === 'bullet' && '•'}
                            {option.value === 'enumerate' && '1.'}
                            {option.value === 'caption' && 'C'}
                        </span>
                        <span>{option.label}</span>
                    </button>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteChunk(chunkIndex);
                            onClose();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Title Input */}
                <div className="mb-8">
                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled"
                        className="w-full text-5xl font-bold border-none outline-none bg-transparent resize-none placeholder-gray-400"
                        rows={1}
                        style={{ 
                            minHeight: '60px',
                            lineHeight: '1.1'
                        }}
                        onInput={(e) => {
                            // Auto-resize textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                // Focus the first chunk
                                setTimeout(() => {
                                    const firstChunk = document.querySelector('[data-chunk-index="0"] textarea');
                                    if (firstChunk) {
                                        firstChunk.focus();
                                    }
                                }, 10);
                            }
                        }}
                    />
                </div>

                <div className="space-y-1">
                    {chunks.map((chunk, index) => (
                        <div
                            key={chunk.serial}
                            data-chunk-index={index}
                            className="group relative flex items-start hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            {/* Left side controls */}
                            <div className={`flex items-center space-x-1 pr-2 py-2 transition-opacity ${
                                showStylePopup === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                                {/* Three dots menu */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowStylePopup(showStylePopup === index ? null : index);
                                        }}
                                        className="three-dots-button p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                                        title="Change block type"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <circle cx="3" cy="8" r="1"/>
                                            <circle cx="8" cy="8" r="1"/>
                                            <circle cx="13" cy="8" r="1"/>
                                        </svg>
                                    </button>

                                    {/* Style popup */}
                                    {showStylePopup === index && (
                                        <StylePopup 
                                            chunkIndex={index} 
                                            onClose={() => setShowStylePopup(null)} 
                                        />
                                    )}
                                </div>
                                
                                {/* Drag handle */}
                                <button
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                                    title="Drag to reorder"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <rect x="3" y="3" width="2" height="2"/>
                                        <rect x="7" y="3" width="2" height="2"/>
                                        <rect x="11" y="3" width="2" height="2"/>
                                        <rect x="3" y="7" width="2" height="2"/>
                                        <rect x="7" y="7" width="2" height="2"/>
                                        <rect x="11" y="7" width="2" height="2"/>
                                        <rect x="3" y="11" width="2" height="2"/>
                                        <rect x="7" y="11" width="2" height="2"/>
                                        <rect x="11" y="11" width="2" height="2"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Content area */}
                            <div 
                                className="flex-1 py-2 min-h-[40px]"
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                {renderChunkContent(chunk, index)}
                            </div>

                            {/* Right side controls */}
                            <div className="flex items-center space-x-1 pl-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => addChunk(index + 1)}
                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                                    title="Add block below"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add new block button */}
                <div className="mt-4">
                    <button
                        onClick={() => addChunk()}
                        className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Add new block</span>
                    </button>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleSaveDraft}
                            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={() => setShowPublishModal(true)}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </div>

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Publish Article</h2>
                                <button
                                    onClick={() => setShowPublishModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Topics Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Topics
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {publishData.topics.map((topic, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                                >
                                                    {topic}
                                                    <button
                                                        onClick={() => removeTopic(topic)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={publishData.topicInput}
                                            onChange={(e) => setPublishData(prev => ({ ...prev, topicInput: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTopic(publishData.topicInput);
                                                }
                                            }}
                                            placeholder="Add topics..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {publishData.topicInput && (
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {suggestedTopics
                                                        .filter(topic => 
                                                            topic.toLowerCase().includes(publishData.topicInput.toLowerCase()) &&
                                                            !publishData.topics.includes(topic)
                                                        )
                                                        .slice(0, 6)
                                                        .map((topic) => (
                                                            <button
                                                                key={topic}
                                                                onClick={() => addTopic(topic)}
                                                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50"
                                                            >
                                                                {topic}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Publication Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Publication
                                    </label>
                                    <select
                                        value={publishData.publication}
                                        onChange={(e) => setPublishData(prev => ({ ...prev, publication: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a publication</option>
                                        {publications.map((pub) => (
                                            <option key={pub.id} value={pub.id}>
                                                {pub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Featured Image Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Featured Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="featured-image"
                                        />
                                        <label
                                            htmlFor="featured-image"
                                            className="cursor-pointer"
                                        >
                                            {publishData.featuredImage ? (
                                                <div>
                                                    <p className="text-green-600 font-medium">
                                                        {publishData.featuredImage.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Click to change image
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Category Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={publishData.category}
                                        onChange={(e) => setPublishData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowPublishModal(false)}
                                    className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePublish}
                                    className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Publish Article
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
