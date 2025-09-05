# REKO
## Modern Blogging Platform with Collections

A clean, intuitive blogging platform that allows users to create, publish, and organize their articles into personal collections.

---

## ✨ Features

### 📝 **Content Creation**
- Rich text editor with formatting options
- Image upload and embedding
- Auto-save drafts
- Article publishing and management

### 📚 **Personal Collections**
- Create multiple collections to organize your articles
- Categorize content by topics, themes, or any custom organization
- Save articles to specific collections
- Manage and curate your content library

### 👥 **Social Features**
- Follow other writers
- Like and comment on articles
- User profiles with bio and avatar
- Discover trending content

### 🔍 **Discovery**
- Search articles by title, content, and tags
- Browse by categories and topics
- Personalized content recommendations
- Trending articles and authors

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Laravel 10** - PHP framework
- **MySQL 8.0** - Database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Laravel Sanctum** - API authentication

### Development
- **Docker** - Containerization
- **Vite** - Build tool
- **ESLint & Prettier** - Code formatting
- **PHPUnit** - Backend testing
- **Jest** - Frontend testing

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Composer
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/reko.git
   cd reko
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan serve
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

---

## 📖 Core Concepts

### Collections
Personal collections allow users to organize their articles into themed groups. Examples:
- "Tech Tutorials"
- "Travel Stories" 
- "Food Reviews"
- "Personal Thoughts"

Each collection can contain multiple articles and helps users categorize their content for better organization and discovery.

### Articles
Rich content pieces with:
- Title and content with formatting
- Featured images
- Tags for categorization
- Reading time estimation
- View and engagement metrics

---

## 🔧 Configuration

### Environment Variables
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reko
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-jwt-secret
JWT_TTL=1440

# File Storage
FILESYSTEM_DISK=local
```

---

## 📡 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/me` - Get current user

### Articles
- `GET /api/articles` - List articles
- `POST /api/articles` - Create article
- `GET /api/articles/{id}` - Get article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article

### Collections
- `GET /api/collections` - List user collections
- `POST /api/collections` - Create collection
- `POST /api/collections/{id}/articles` - Add article to collection
- `DELETE /api/collections/{id}/articles/{articleId}` - Remove from collection

---

## 🧪 Testing

### Backend Tests
```bash
cd Backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For support and questions, please open an issue in the GitHub repository.