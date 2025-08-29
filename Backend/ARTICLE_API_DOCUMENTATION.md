# Article API Documentation

This documentation covers all the article management APIs with comprehensive functionality and edge case handling.

## Base URL
```
/api/articles/
```

## Authentication
Protected endpoints require JWT authentication via Bearer token in Authorization header:
```
Authorization: Bearer {jwt_token}
```

---

## API Endpoints

### 1. Get All Articles (Public)
**GET** `/api/articles/`

Retrieve paginated list of published articles with filtering and sorting.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (1-100, default: 15)
- `search` (optional): Search in title, content, excerpt
- `category_id` (optional): Filter by category ID
- `user_id` (optional): Filter by author ID
- `sort` (optional): Sort order (`latest`, `oldest`, `title_asc`, `title_desc`)

**Success Response (200):**
```json
{
    "message": "Articles retrieved successfully",
    "data": {
        "articles": [
            {
                "id": 1,
                "title": "Sample Article",
                "content": "Article content...",
                "slug": "sample-article",
                "excerpt": "Article summary...",
                "status": "published",
                "featured_image": "articles/featured/image.jpg",
                "created_at": "2025-08-04T12:00:00.000000Z",
                "updated_at": "2025-08-04T12:00:00.000000Z",
                "reading_time": 5,
                "word_count": 1000,
                "user": {
                    "id": 1,
                    "username": "john_doe",
                    "email": "john@example.com"
                },
                "category": {
                    "id": 1,
                    "name": "Technology"
                }
            }
        ],
        "pagination": {
            "current_page": 1,
            "per_page": 15,
            "total": 25,
            "last_page": 2,
            "has_more_pages": true
        }
    }
}
```

---

### 2. Create Article (Protected)
**POST** `/api/articles/`

Create a new article.

**Request Body:**
```json
{
    "title": "Article Title",
    "content": "Full article content...",
    "category_id": 1,
    "slug": "custom-slug",
    "excerpt": "Article summary",
    "status": "draft",
    "featured_image": "file upload"
}
```

**Required Fields:**
- `title`: string, max 255 characters
- `content`: string

**Optional Fields:**
- `category_id`: integer, must exist in categories table
- `slug`: string, max 255, unique (auto-generated if not provided)
- `excerpt`: string, max 500 (auto-generated if not provided)
- `status`: enum (`draft`, `published`) default: `draft`
- `featured_image`: image file (jpeg, png, jpg, gif, max 2MB)

**Success Response (201):**
```json
{
    "message": "Article created successfully",
    "data": {
        "article": {
            "id": 1,
            "title": "Article Title",
            "slug": "article-title",
            "status": "draft",
            // ... other fields
        }
    }
}
```

---

### 3. Get Single Article (Public)
**GET** `/api/articles/{slug}`

Get a specific published article by slug.

**Success Response (200):**
```json
{
    "message": "Article retrieved successfully",
    "data": {
        "article": {
            "id": 1,
            "title": "Article Title",
            // ... full article data
        }
    }
}
```

**Error Responses:**
- 404: Article not found or not published

---

### 4. Update Article (Protected)
**PUT** `/api/articles/{id}`

Update an existing article (only by owner).

**Request Body:** Same as create, all fields optional

**Success Response (200):**
```json
{
    "message": "Article updated successfully",
    "data": {
        "article": {
            // ... updated article data
        }
    }
}
```

**Error Responses:**
- 403: Unauthorized (not article owner)
- 404: Article not found

---

### 5. Delete Article (Protected)
**DELETE** `/api/articles/{id}`

Delete an article (only by owner).

**Success Response (200):**
```json
{
    "message": "Article deleted successfully"
}
```

**Error Responses:**
- 403: Unauthorized (not article owner)
- 404: Article not found

---

### 6. Get My Articles (Protected)
**GET** `/api/articles/my/articles`

Get authenticated user's articles with statistics.

**Query Parameters:**
- `page`, `per_page`: Pagination
- `status`: Filter by status (`draft`, `published`, `deleted`)
- `search`: Search in user's articles

**Success Response (200):**
```json
{
    "message": "Your articles retrieved successfully",
    "data": {
        "articles": [...],
        "pagination": {...},
        "stats": {
            "total_articles": 10,
            "published_articles": 7,
            "draft_articles": 3
        }
    }
}
```

---

### 7. Publish Article (Protected)
**PATCH** `/api/articles/{id}/publish`

Change article status to published.

**Success Response (200):**
```json
{
    "message": "Article published successfully",
    "data": {
        "article": {
            "status": "published",
            // ... other fields
        }
    }
}
```

**Error Responses:**
- 403: Unauthorized (not article owner)
- 409: Already published
- 404: Article not found

---

### 8. Make Article Draft (Protected)
**PATCH** `/api/articles/{id}/draft`

Change article status to draft.

**Success Response (200):**
```json
{
    "message": "Article moved to draft successfully",
    "data": {
        "article": {
            "status": "draft",
            // ... other fields
        }
    }
}
```

**Error Responses:**
- 403: Unauthorized (not article owner)
- 409: Already draft
- 404: Article not found

---

### 9. Get Published Articles (Public)
**GET** `/api/articles/published`

Get only published articles (optimized for public consumption).

**Query Parameters:**
- `page`, `per_page`: Pagination (per_page max: 50, default: 12)
- `search`: Search published articles
- `category_id`: Filter by category

**Success Response (200):**
```json
{
    "message": "Published articles retrieved successfully",
    "data": {
        "articles": [...],
        "pagination": {...}
    }
}
```

---

## Article Model Features

### Auto-Generated Fields
- **Slug**: Auto-generated from title if not provided, ensures uniqueness
- **Excerpt**: Auto-generated from content (150 characters) if not provided

### Computed Attributes
- `reading_time`: Estimated reading time in minutes (200 words/minute)
- `word_count`: Total words in content
- `formatted_created_at`: Human-readable creation date
- `formatted_updated_at`: Human-readable update date

### Status Management
- `draft`: Not visible to public
- `published`: Visible to public
- `deleted`: Soft deleted (not actually removed from database)

### Relationships
- **User**: Article belongs to a user (author)
- **Category**: Article belongs to a category (optional)
- **Collections**: Article can be in multiple collections

### Scopes Available
- `published()`: Only published articles
- `draft()`: Only draft articles
- `byStatus($status)`: Filter by specific status
- `search($term)`: Search in title, content, excerpt
- `byCategory($categoryId)`: Filter by category
- `byUser($userId)`: Filter by user

---

## File Upload

### Featured Image
- **Accepted formats**: JPEG, PNG, JPG, GIF
- **Max size**: 2MB
- **Storage**: `storage/app/public/articles/featured/`
- **Naming**: `timestamp_randomstring.extension`
- **Auto-cleanup**: Old images deleted when updated

---

## Error Handling

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (access denied)
- **404**: Not Found
- **409**: Conflict (already in that state)
- **422**: Validation Failed
- **500**: Server Error

### Error Response Format
```json
{
    "error": "Error Type",
    "message": "Human readable message",
    "errors": {
        "field": ["Validation error message"]
    }
}
```

---

## Security Features

### Authorization
- Users can only modify their own articles
- Proper ownership checks on all write operations

### Input Validation
- Title length limits
- File type and size validation
- Status enum validation
- Unique slug enforcement

### Data Protection
- Auto-sanitization of HTML content
- SQL injection prevention through Eloquent ORM
- XSS protection through proper data handling

---

## Performance Optimizations

### Database
- Indexes on frequently queried fields
- Eager loading of relationships
- Efficient pagination

### Caching
- Consider implementing Redis cache for published articles
- Cache article counts and statistics

### File Storage
- Optimized image storage structure
- Automatic cleanup of unused files

---

## Usage Examples

### Create and Publish Article
```bash
# 1. Create draft article
POST /api/articles/
{
    "title": "My New Article",
    "content": "Article content here...",
    "category_id": 1
}

# 2. Publish the article
PATCH /api/articles/1/publish
```

### Search Published Articles
```bash
GET /api/articles/published?search=laravel&category_id=1&per_page=10
```

### Get User's Draft Articles
```bash
GET /api/articles/my/articles?status=draft&page=1
```
