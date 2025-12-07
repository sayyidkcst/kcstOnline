// LOGIN PAGE BUTTON
if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(() => {
        window.location.href = "certificates.html";
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
      });
  });
}

// LOGOUT BUTTON
if (document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    auth.signOut().then(() => {
      window.location.href = "index.html";
    });
  });
}

// LOAD CERTIFICATES PAGE
if (document.getElementById("certificateList")) {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const uid = user.uid;

    db.collection("certificates")
      .where("uid", "==", uid)
      .get()
      .then((snap) => {
        let output = "";

        snap.forEach((doc) => {
          const data = doc.data();
          output += `
            <div class="card">
              <h3>${data.title}</h3>
              <img src="${data.url}" alt="Certificate">
            </div>
          `;
        });

        document.getElementById("certificateList").innerHTML = output;
      });
  });
}
