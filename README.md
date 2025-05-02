<div align="center">
  <img src="https://raw.githubusercontent.com/Nirajd071/discussync/main/frontend/public/logo.svg" alt="DiscusSync Logo" width="200" height="200" />

  # ✨ DiscusSync ✨

  <p align="center">
    <img src="https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge" alt="Version 2.0.0" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
  </p>

  <h3>A modern platform for meaningful discussions and knowledge sharing</h3>

  <p align="center">
    <a href="#demo">View Demo</a> •
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#contributing">Contributing</a>
  </p>

  <img src="https://raw.githubusercontent.com/Nirajd071/discussync/main/frontend/public/screenshot.png" alt="DiscusSync Screenshot" width="80%" />
</div>

<br />

<div align="center">
  <img src="https://raw.githubusercontent.com/Nirajd071/discussync/main/frontend/public/tech-stack.png" alt="Tech Stack" width="80%" />
</div>

## 🚀 Features

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🌓 Light & Dark Mode</h3>
      <p align="center">
        <img src="https://raw.githubusercontent.com/Nirajd071/discussync/main/frontend/public/theme-toggle.gif" alt="Theme Toggle" width="100%" />
      </p>
      <p align="center">Seamless theme switching for comfortable viewing in any environment</p>
    </td>
    <td width="50%">
      <h3 align="center">💬 Real-time Discussions</h3>
      <p align="center">
        <img src="https://raw.githubusercontent.com/Nirajd071/discussync/main/frontend/public/discussions.gif" alt="Discussions" width="100%" />
      </p>
      <p align="center">Create, join, and participate in meaningful conversations</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">👤 User Profiles</h3>
      <p align="center">
        <img src="https://raw.githubusercontent.com/Nirajd071/discussync/main/frontend/public/profile.gif" alt="User Profiles" width="100%" />
      </p>
      <p align="center">Customizable profiles with avatars and personal information</p>
    </td>
    <td width="50%">
      <h3 align="center">🔔 Notifications</h3>
      <p align="center">
        <img src="https://raw.githubusercontent.com/Nirajd071/discussync/main/frontend/public/notifications.gif" alt="Notifications" width="100%" />
      </p>
      <p align="center">Stay updated with real-time notifications</p>
    </td>
  </tr>
</table>

## ✨ Key Features

- **🔐 Authentication & Authorization**: Secure user authentication with JWT
- **💬 Discussions**: Create, edit, and participate in threaded discussions
- **📂 Projects**: Share and showcase your projects with the community
- **👤 User Profiles**: Customizable profiles with avatars and bios
- **🌓 Theme Switching**: Toggle between light and dark modes
- **📱 Responsive Design**: Optimized for all devices from mobile to desktop
- **🔔 Notifications**: Real-time notifications for mentions, replies, and more
- **🔍 Search**: Powerful search functionality across discussions and projects
- **👑 Admin Dashboard**: Comprehensive admin tools for platform management
- **🔄 Real-time Updates**: Stay synchronized with the latest content

## 🛠️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Nirajd071/discussync.git

# Navigate to the project directory
cd discussync

# Install frontend dependencies
cd frontend
npm install

# Start the frontend development server
npm run dev

# In a new terminal, navigate to the backend directory
cd ../backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

## 🚀 Usage

1. **Register/Login**: Create an account or login to access all features
2. **Create Discussions**: Start meaningful conversations on any topic
3. **Share Projects**: Showcase your work with the community
4. **Customize Profile**: Add your avatar and personal information
5. **Engage**: Comment, upvote, and participate in discussions

## 🏗️ Architecture

<div align="center">
  <img src="https://raw.githubusercontent.com/Nirajd071/discussync/main/frontend/public/architecture.png" alt="Architecture Diagram" width="80%" />
</div>

DiscusSync follows a modern client-server architecture:

- **Frontend**: React with TypeScript, using Vite for fast development
- **UI Components**: shadcn/ui and Tailwind CSS for beautiful, responsive interfaces
- **Backend**: FastAPI for high-performance API endpoints
- **Database**: PostgreSQL for reliable data storage
- **Authentication**: JWT-based authentication for secure user sessions
- **State Management**: React Context API for efficient state management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [FastAPI](https://fastapi.tiangolo.com/)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Nirajd071">Niraj Deshmukh</a></p>

  <a href="https://github.com/Nirajd071">
    <img src="https://img.shields.io/github/followers/Nirajd071?label=Follow&style=social" alt="GitHub followers" />
  </a>
</div>
