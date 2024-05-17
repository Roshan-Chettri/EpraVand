import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
       <nav className="navbar">
        <div className="navdiv">
            <div className="logo">
                
                <Link to="/">
                    <img src={`${process.env.PUBLIC_URL}/logos/EPraVand Logo.png`} alt ="epravand logo"/>
                </Link>   
           
            </div>
            <ul>
                <li> <Link to='/'>Home</Link> </li>
                <li><a href="#"> Coordinator </a></li>
                <li><a href="#"> Contact </a></li>
            </ul>
        </div>
     </nav>
    </header>
  );
};

export default Header;