import React, { useState } from "react";
import "../index.css";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <p className="navbar-brand-text">SOLANA - Hero Token Tracker</p>
      </div>
    </nav>
  );
}
