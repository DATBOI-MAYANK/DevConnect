# 🚀 DevConnect

**DevConnect** is a developer-focused social platform that blends GitHub-style repositories and Twitter-style micro-posts. Share code snippets, project updates, and connect with fellow developers—all in one place.

---

## 🌟 Features

- **User Authentication** – Secure signup/login with JWT and bcrypt password hashing
- **Post Feed** – Share text, images, videos, and code updates with syntax highlighting
- **Media Upload** – Upload images and videos via Cloudinary integration
- **GitHub Integration** – Display and showcase your public repositories
- **Social Interactions** – Like posts, comment, and follow other developers
- **User Profiles** – Comprehensive profile pages with posts, repos, and activity
- **Responsive Design** – Clean UI built with React and TailwindCSS, works on all devices
- **Real-time Updates** – Dynamic content loading with modern React patterns

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Redux Toolkit, React Router, TailwindCSS |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Media Storage** | Cloudinary |
| **Build Tools** | Vite, ESLint |
| **Deployment** | Ready for Vercel, Heroku, or similar platforms |

---

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DATBOI-MAYANK/DevConnect.git
cd DevConnect
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

Start the backend server:

```bash
npm run server
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📁 Project Structure

```
DevConnect/
├── backend/
│   ├── Database/          # Database connection
│   ├── Routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middlewares
│   ├── models/          # Mongoose models
│   ├── utils/           # Utility functions
│   ├── constants/       # App constants
│   ├── public/          # Static files
│   ├── app.js           # Express app configuration
│   ├── index.js         # Server entry point
│   └── package.json     # Backend dependencies
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/       # Page components
    │   ├── store/       # Redux store and slices
    │   ├── utils/       # Utility functions
    │   └── App.jsx      # Main app component
    ├── public/          # Static assets
    ├── index.html       # HTML template
    ├── vite.config.js   # Vite configuration
    └── package.json     # Frontend dependencies
```

---

## 🔧 Available Scripts

### Backend

- `npm run server` - Start the development server with nodemon

### Frontend

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

---

## 🔐 Environment Variables

Create `.env` files in both backend and frontend directories:

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📱 Screenshots

_Add screenshots of your application here to showcase the UI_

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mayank** - [@DATBOI-MAYANK](https://github.com/DATBOI-MAYANK)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the excellent database
- Cloudinary for media storage solutions
- TailwindCSS for the utility-first CSS framework

---

## 📞 Support

If you have any questions or need help, feel free to:

- Open an issue on GitHub
- Contact me via email
- Connect with me on social media

---

**Happy Coding! 🚀**