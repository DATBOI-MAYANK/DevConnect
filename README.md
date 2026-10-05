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

### 4. Run with Docker

Install Docker Desktop and make sure Docker is running. Before starting the
containers, create `backend/.env` and add valid values for `MONGODB_URL`, the
JWT variables, and the Cloudinary variables. This file is used by the backend
container and must not be committed.

Build both images and start the application from the project root:

```bash
docker compose up --build
```

The frontend will be available at `http://localhost:5173` and the backend API
will be available at `http://localhost:8000/users/api/v1`.

The frontend Docker image is a multi-stage build: Vite builds the application
and Nginx serves the generated files. The local API URL is passed as a build
argument by `docker-compose.yml`:

```yaml
VITE_API_BASE_URL: http://localhost:8000/users/api/v1
```

If you build the frontend image manually, pass the API URL explicitly:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8000/users/api/v1 \
  -t devconnect-frontend ./frontend
docker build -t devconnect-backend ./backend
```

For a deployed frontend, use the public Render backend URL instead of
`localhost`, for example:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://your-backend.onrender.com/users/api/v1 \
  -t devconnect-frontend ./frontend
```

Because Vite embeds `VITE_API_BASE_URL` during the build, rebuild the frontend
image whenever this value changes.

To stop the containers:

```bash
docker compose down
```

To rebuild and start the containers after a code or environment change:

```bash
docker compose up --build
```

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


<img width="1348" height="720" alt="Screenshot from 2026-01-29 19-58-33" src="https://github.com/user-attachments/assets/885933f0-b497-4cdd-bd2a-0f584ed7c96f" /> 
<img width="1348" height="720" alt="Screenshot from 2026-01-29 19-58-46" src="https://github.com/user-attachments/assets/607b0905-9a04-43d2-9d40-2eda1790c7df" />


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Features under development 
 
 1. Navbar sections 
 2. Edit Post
 3. Follow Users
 4. Github Repo section update



## 👨‍💻 Author

**Mayank** - [@DATBOI-MAYANK](https://github.com/DATBOI-MAYANK)

---



## 📞 Support

If you have any questions or need help, feel free to:

- Open an issue on GitHub
- Contact me via email
- Connect with me on social media

---
