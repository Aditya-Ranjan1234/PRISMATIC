import React, { useState } from "react";
import "../public/Header.css";
import RandomIcons from "../../src/RandomIcons";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <header className="d-flex flex-wrap align-items-center justify-content-between py-3 mb-3 Header">
      <RandomIcons />
      <div className="col-md-5 mb-2 mb-md-0 text-left">
        <h1 className="text-white">SnapSafe</h1>
      </div>
      <div className="dropdown d-md-none">
        <button
          className="btn btn-link dropdown-toggle text-white"
          type="button"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          Menu
        </button>
        {isOpen && (
          <ul className="dropdown-menu show">
            <li>
              <a href="/" className="dropdown-item text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="dropdown-item text-white">
                About Us
              </a>
            </li>
          </ul>
        )}
      </div>
      <ul className="nav col-9 col-md-auto mb-2 justify-content-end mb-md-0 d-none d-md-flex align-items-center">
        <li className="nav-item">
          <a href="/" className="nav-link px-2 text-white">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a href="/about" className="nav-link px-2 text-white">
            About Us
          </a>
        </li>
      </ul>
    </header>
  );
}

export default Header;
