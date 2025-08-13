import React, { useState, useRef, useEffect } from 'react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(['Technology', 'Writing']);
  const [newTag, setNewTag] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [publication, setPublication] = useState('');
  const [draftStatus, setDraftStatus] = useState('Draft saved');
  const [statusColor, setStatusColor] = useState('text-gray-500');

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const contentRef = useRef(null);
  const autoSaveTimer = useRef(null);

  // Auto-resize function
  const autoResize = (element) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  // Auto-save simulation
  const simulateAutoSave = () => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    
    autoSaveTimer.current = setTimeout(() => {
      setDraftStatus('Draft saved');
      setStatusColor('text-green-600');
      
      setTimeout(() => {
        setDraftStatus('Draft saved');
        setStatusColor('text-gray-500');
      }, 2000);
    }, 2000);
  };

  // Handle content changes with auto-save
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    autoResize(e.target);
    simulateAutoSave();
  };

  const handleSubtitleChange = (e) => {
    setSubtitle(e.target.value);
    autoResize(e.target);
    simulateAutoSave();
  };

  // Handle content changes from Tiptap editor
  const handleContentChange = (newContent) => {
    setContent(newContent);
    simulateAutoSave();
  };

  // Handle tag addition
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Auto-resize on mount and content changes
  useEffect(() => {
    autoResize(titleRef.current);
    autoResize(subtitleRef.current);
  }, [title, subtitle]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="#" className="text-2xl font-bold text-black">Reko</a>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span className="text-gray-600">Write</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${statusColor}`}>{draftStatus}</span>
              
              <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 text-sm font-medium rounded-full">
                Publish
              </button>
              
              <button className="text-gray-600 hover:text-black transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
              
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
                  alt="Alex Chen" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Input */}
        <div className="mb-8">
          <textarea 
            ref={titleRef}
            placeholder="Title" 
            className="w-full text-4xl md:text-5xl font-bold text-black placeholder-gray-400 border-none outline-none resize-none overflow-hidden leading-tight"
            style={{ fontFamily: 'Charter, Georgia, Times, serif' }}
            rows="1"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        {/* Subtitle Input */}
        <div className="mb-12">
          <textarea 
            ref={subtitleRef}
            placeholder="Tell your story..." 
            className="w-full text-xl text-gray-600 placeholder-gray-400 border-none outline-none resize-none overflow-hidden leading-relaxed"
            style={{ fontFamily: 'Charter, Georgia, Times, serif' }}
            rows="1"
            value={subtitle}
            onChange={handleSubtitleChange}
          />
        </div>

        

        {/* Content Editor - Tiptap */}
        <div className="mb-16">
          <div className="tiptap-editor-wrapper" style={{ fontFamily: 'Charter, Georgia, Times, serif' }}>
            <SimpleEditor 
              content={content}
              onUpdate={handleContentChange}
              placeholder="Write your story..."
              className="w-full min-h-96 text-lg text-gray-900 leading-relaxed outline-none prose prose-lg max-w-none"
            />
          </div>
        </div>

        {/* Article Settings */}
        <aside className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-black mb-6">Story settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    {tag}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => removeTag(tag)}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Add tag..." 
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>

            {/* Publication */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Publish in</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                value={publication}
                onChange={(e) => setPublication(e.target.value)}
              >
                <option value="">Your profile</option>
                <option value="techcrunch">TechCrunch</option>
                <option value="medium">Medium</option>
                <option value="hackernews">Hacker News</option>
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Story visibility</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="public" 
                    checked={visibility === 'public'}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="text-black focus:ring-black border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Public - visible to everyone</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="unlisted" 
                    checked={visibility === 'unlisted'}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="text-black focus:ring-black border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Unlisted - only with link</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="private" 
                    checked={visibility === 'private'}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="text-black focus:ring-black border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Private - only you</span>
                </label>
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Featured image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-black hover:text-gray-700 cursor-pointer">Upload a file</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-600 hover:text-black transition-colors duration-200">
                Save as draft
              </button>
              <button className="text-sm text-gray-600 hover:text-black transition-colors duration-200">
                Preview
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-black hover:text-black transition-colors duration-200 text-sm font-medium rounded">
                Cancel
              </button>
              <button className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200 text-sm font-medium rounded">
                Publish story
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CreateBlog;