# SplitBuddy Backend

This is the backend server for the SplitBuddy application, built with Node.js, Express, and MongoDB.

## Prerequisites

-   Node.js (v14+)
-   MongoDB (Running locally or Atlas URI)

## Installation

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/splitbuddy
JWT_SECRET=your_jwt_secret_key_here
```

## Running the Server

-   **Development Mode** (with nodemon):
    ```bash
    npm run dev
    ```
-   **Production Mode**:
    ```bash
    npm start
    ```

## API Documentation

Import the `postman_collection.json` file into Postman to test the API endpoints.

## Real-time Features

Socket.io is enabled on the same port as the HTTP server. Connect to `http://localhost:5000` from the client.
