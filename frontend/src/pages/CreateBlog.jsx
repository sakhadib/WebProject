import React, { useState, useRef, useEffect } from 'react';

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

  const handleContentChange = (e) => {
    setContent(e.target.innerHTML);
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
              
              <span className="text-gray-600">Publish your blog</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${statusColor}`}>{draftStatus}</span>
              
              <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 text-sm font-medium rounded-full">
                Publish
              </button>
              
              
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

        {/* Toolbar */}
        <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-gray-200">
          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors duration-200" title="Bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zm0 8h7a3 3 0 013 3 3 3 0 01-3 3H6z"/>
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors duration-200" title="Italic">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 4H9m1.5 16H4m7-9l2-2m0 0l2-2m-2 2l-2 2"/>
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors duration-200" title="Link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors duration-200" title="Quote">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors duration-200" title="Code">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors duration-200" title="Add Image">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors duration-200" title="Embed">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"/>
            </svg>
          </button>
        </div>

        {/* Content Editor */}
        <div className="mb-16">
          <div 
            ref={contentRef}
            contentEditable="true" 
            className="w-full min-h-96 text-lg text-gray-900 leading-relaxed outline-none"
            style={{ fontFamily: 'Charter, Georgia, Times, serif' }}
            onInput={handleContentChange}
            suppressContentEditableWarning={true}
          >
            {!content && <p className="text-gray-400 pointer-events-none">Write your story...</p>}
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