# Manual Data Import Guide for MongoDB Atlas

You can manually add data to your database using **MongoDB Compass** and the JSON templates we created.

## 📂 Templates Location
You will find 3 template files in your project folder:
`e:\nikhilprojects\Smart-Rental-Management\seed_templates\`
1.  `users.json`
2.  `properties.json`
3.  `rooms.json`

## ⚠️ Crucial Order of Operations
Because the data is relational (Properties belong to Users, Rooms belong to Properties), you must import them in this exact order:

**1. Users -> 2. Properties -> 3. Rooms**

---

## Step 1: Import Users (`users.json`)
1.  Open **MongoDB Compass** and connect to your Atlas Cluster.
2.  Navigate to `smart_rental_db` -> `users`.
3.  Click **Add Data** -> **Import JSON or CSV**.
4.  Select `seed_templates/users.json`.
5.  **Important**: For the `password` field, manual import is tricky because passwords must be encrypted (hashed).
    *   **Recommendation**: Copy the `password` string from an existing user (like the one you registered on the site) and paste it into the JSON file *before* importing, or update it in Compass after importing.
6.  Click **Import**.
7.  **COPY THE `_id`**: After import, copy the `_id` of the property owner you just added. You will need it for the next step.

## Step 2: Import Properties (`properties.json`)
1.  Open `seed_templates/properties.json` in your code editor.
2.  Find the `"owner"` field.
3.  Replace `"REPLACE_WITH_OWNER_ID_FROM_MONGODB"` with the `_id` you copied in Step 1.
    *   Example: `"owner": { "$oid": "6595c18a2ad2e9df6d1473304" }`
4.  Save the file.
5.  In MongoDB Compass, navigate to `smart_rental_db` -> `properties`.
6.  Click **Add Data** -> **Import JSON or CSV** and select the modified `properties.json`.
7.  Click **Import**.
8.  **COPY THE `_id`**: Copy the `_id` of the property you just added.

## Step 3: Import Rooms (`rooms.json`)
1.  Open `seed_templates/rooms.json` in your code editor.
2.  Find the `"property"` field.
3.  Replace `"REPLACE_WITH_PROPERTY_ID_FROM_MONGODB"` with the `_id` you copied in Step 2.
4.  Save the file.
5.  In MongoDB Compass, navigate to `smart_rental_db` -> `rooms`.
6.  Click **Add Data** -> **Import JSON or CSV** and select the modified `rooms.json`.
7.  Click **Import**.

## ✅ Done!
Refresh your application, and you should see the new properties and rooms listed.
