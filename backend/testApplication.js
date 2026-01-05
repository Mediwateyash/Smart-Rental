
// backend/testApplication.js
// Using 127.0.0.1
// Need to find a room ID first. This script will find a room and apply for it as admin (admin is also a user).

const run = async () => {
    try {
        console.log("Logging in...");
        const loginRes = await fetch("http://127.0.0.1:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@smartrental.com", password: "admin123" })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error("Login failed: " + JSON.stringify(loginData));
        console.log("Logged in.");

        console.log("Fetching Rooms to find an ID...");
        const roomRes = await fetch("http://127.0.0.1:5000/api/rooms");
        const rooms = await roomRes.json();
        if (rooms.length === 0) {
            console.log("No rooms found to apply for.");
            return;
        }
        const roomId = rooms[0]._id;
        console.log("Applying for Room ID:", roomId);

        const appRes = await fetch("http://127.0.0.1:5000/api/applications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginData.token
            },
            body: JSON.stringify({ roomId })
        });

        const appData = await appRes.json();
        console.log("Application Response:", appRes.status, appData);

    } catch (err) {
        console.error("Error:", err);
    }
};

run();
