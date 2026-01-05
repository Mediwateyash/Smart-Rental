
// backend/testAddProperty.js
// Using 127.0.0.1 to avoid localhost ipv6 issues

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
        console.log("Logged in. Token:", loginData.token);

        console.log("Adding property...");
        const propRes = await fetch("http://127.0.0.1:5000/api/properties", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginData.token
            },
            body: JSON.stringify({
                title: "Test Property",
                address: "123 Test St",
                city: "Test City",
                rent: 10000,
                bedrooms: 2,
                bathrooms: 2,
                coverImage: "https://via.placeholder.com/150",
                images: ["https://via.placeholder.com/150"],
                amenities: ["Wifi", "Parking"]
            })
        });

        const propData = await propRes.json();
        if (!propRes.ok) {
            console.error("Add Property Failed Status:", propRes.status);
            console.error("Response:", propData);
        } else {
            console.log("Property Added Successfully:", propData);
        }

    } catch (err) {
        console.error("Error:", err);
    }
};

run();
