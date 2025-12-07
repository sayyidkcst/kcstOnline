<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admin - Upload Certificates</title>

  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js"></script>

  <script src="firebaseConfig.js"></script>
  <script src="admin.js"></script>

  <style>
    body {
      background: #f4f4f4;
      font-family: Arial;
      padding: 20px;
    }

    h1 { text-align: center; }

    .box {
      max-width: 400px;
      background: white;
      padding: 20px;
      margin: auto;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }

    input, select {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    button {
      width: 100%;
      padding: 12px;
      background: #4285F4;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }

    #logoutBtn {
      margin-top: 20px;
      background: #d9534f;
    }
  </style>

</head>
<body>

  <h1>Admin Panel</h1>

  <div class="box">

    <input type="email" id="userEmail" placeholder="User Email (the person receiving certificate)">

    <input type="text" id="title" placeholder="Certificate Title">

    <input type="file" id="fileInput">

    <button id="uploadBtn">Upload Certificate</button>

    <button id="logoutBtn">Logout</button>

  </div>

</body>
</html>
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // allow only admin email
  if (user.email !== "YOUR_ADMIN_EMAIL@gmail.com") {
    alert("Access denied!");
    auth.signOut();
    return;
  }
});

// Upload certificate
document.getElementById("uploadBtn").addEventListener("click", async () => {
  const email = document.getElementById("userEmail").value;
  const title = document.getElementById("title").value;
  const file = document.getElementById("fileInput").files[0];

  if (!email || !title || !file) {
    alert("Please fill all fields");
    return;
  }

  const uid = email.replace("@", "_").replace(".", "_"); // Convert email to safe ID

  const storageRef = firebase.storage().ref("certificates/" + Date.now() + "_" + file.name);
  await storageRef.put(file);
  const url = await storageRef.getDownloadURL();

  await db.collection("certificates").add({
    uid: uid,
    title: title,
    url: url
  });

  alert("Certificate uploaded!");
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});
