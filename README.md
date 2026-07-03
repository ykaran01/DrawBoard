# 🎨 DrawBoard

A modern **real-time collaborative whiteboard** built with the MERN stack, **Fabric.js**, and **Socket.IO**. Draw, collaborate, and brainstorm with others instantly from anywhere.



---

## ✨ Features

* 🎨 Freehand drawing
* 📐 Draw rectangles, circles, lines, and other shapes
* ✏️ Pencil and eraser tools
* 🌈 Custom colors and brush sizes
* 🖐️ Canvas panning
* 🔍 Zoom in & out
* ⚡ Real-time collaboration using Socket.IO
* 👥 Multiple users can draw simultaneously
* 💾 Save whiteboards
* 📂 Load previously created boards
* 🔐 Secure authentication with JWT
* ☁️ Cloud image storage
* 📱 Responsive design
* 🌙 Clean minimal UI

---

## 🛠 Tech Stack

### Frontend

* React
* Tailwind CSS
* Fabric.js
* React Router
* Axios
* Socket.IO Client
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication
* bcrypt
* Cookie Parser
* Cloudinary

---

## 📁 Project Structure

```
DrawBoard/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── pages/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   └── utils/
│
└── README.md
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/your-username/drawboard.git
```

```bash
cd drawboard
```

---

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd server
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGODB_URL=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=7d

ADMIN_EMAIL=your_email
PASS=your_email_password

CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

---

## ▶️ Running the Project

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

## 🖼 Screenshots

Add screenshots of:

* Login Page
* Dashboard
* Whiteboard
* Real-time Collaboration
* Drawing Tools

Example:

```
screenshots/
├── login.png
├── dashboard.png
├── whiteboard.png
└── collaboration.png
```

---

## 🌟 Future Improvements

* Sticky Notes
* Voice Chat
* Video Collaboration
* Infinite Canvas
* Version History
* Undo/Redo History Sync
* Board Sharing via Link
* Comments
* Templates
* Export as PDF
* Mobile Drawing Support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Added new feature"
```

4. Push to the branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Karan**

Computer Science Student

Built with ❤️ using React, Node.js, MongoDB, Fabric.js, and Socket.IO.

---

## ⭐ Support

If you like this project, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future development.

Happy Coding! 🚀
