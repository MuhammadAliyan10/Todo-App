import React from "react";

const NotAuthenticated = () => {
  return (
    <div className="auth">
      <div className="not__auth">
        <h2>401</h2>
        <p>Login to get access to these pages.</p>
      </div>
    </div>
  );
};

export default NotAuthenticated;
