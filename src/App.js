import React, { useState } from "react";
import Header from "./js/Header";
import Posts from "./js/Posts";
import ImageUpload from "./js/ImageUpload";
import "./css/App.css";
import "./css/elements.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      <Header user={user} setUser={setUser} />
      <Posts user={user} />
      {user && user?.displayName && (
        <ImageUpload username={user?.displayName} />
      )}
    </div>
  );
}

export default App;
