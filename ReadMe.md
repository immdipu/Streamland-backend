# Streamland Backend

Streamland is a feature-rich movie streaming platform built with modern web technologies. This repository contains the backend code for the [Streamland](https://github.com/immdipu/streamland-frontend) project.

[![GitHub stars](https://img.shields.io/github/stars/immdipu/streamland-backend.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/immdipu/streamland-backend/stargazers/)
[![GitHub forks](https://img.shields.io/github/forks/immdipu/streamland-backend.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/immdipu/streamland-backend/network/)
[![GitHub issues](https://img.shields.io/github/issues/immdipu/streamland-backend.svg)](https://GitHub.com/immdipu/streamland-backend/issues/)

## ⚠️ Disclaimer

This project is created for educational and practice purposes only. We do not store or host any movie data or content. The backend serves as an API for user management, watchlists, and chat functionality. All movie information is fetched from external sources. Please use this application responsibly and in compliance with applicable laws.

## 🌟 Features

- RESTful API for user management, movie data, and chat functionality
- User authentication and authorization
- Real-time communication using Socket.IO
- Database integration for storing user data, watchlists, and chat history

## 🚀 Tech Stack

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web application framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Socket.IO](https://socket.io/) - Real-time, bidirectional communication
- [JSON Web Tokens (JWT)](https://jwt.io/) - Secure authentication

## 🛠 Installation

1. Clone the repository: `git clone https://github.com/immdipu/streamland-backend.git`
2. Change to the project directory: `cd streamland-backend`
3. Install the dependencies: `npm install`
4. Create a `.env` file in the root directory and add the following environment variables:

```bash
NODE_ENV="development"
PORT="8080"
BASE_URL="url_where_backend_is_hosted"
DB="your_mongodb_connection_string"
JWT_EXPIRES_IN="90d"
JWT_SECRET="your_jwt_secret"
FRONTEND_URL="http://localhost:3000"
```

5. Start the development server: `npm run dev`

## 📝 API Documentation

The server should now be running on `http://localhost:8080`.

## 🤝 Contributing

We welcome contributions to Streamland! Feel free to open issues and pull requests.

## 🔗 Related Repositories

- [Streamland Frontend](https://github.com/immdipu/streamland-frontend) - The frontend application for Streamland

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- All the amazing open-source libraries and tools that made this project possible

---

⭐️ If you find Streamland interesting or useful, please consider giving it a star! It helps us know that our work is valued and encourages us to continue improving the project.
