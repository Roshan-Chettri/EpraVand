import React from 'react';
import { Link } from 'react-router-dom';


const Header = () => {
  return (
    <header>
       <nav className="navbar">
        <div className="navdiv">
            <div className="logo">
                
                <Link to="/">
                    <img src={'/logos/EPraVand Logo.png'} alt ="epravand logo"/>
                </Link>   
           
            </div>
            <ul>
                <li> <Link to='/'>Home</Link> </li>
                <li><Link to = '/coordinator-login'>Coordinator</Link></li>
                <li><a href='#footer'>Contact Us</a></li>
            </ul>
        </div>
     </nav>
    </header>
  );
};

export default Header;