import React from "react";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="footer">
        <div className="contact">
            <h2> Contact </h2>
            <div className="call_icon">
                <img src="/logos/Contact icon.png" alt = "contact icon"/>
                <p>+91 3592-231666<br/> +91 3592-232666</p>
            </div>
            <div className="email">
                <img src="/logos/Email icon.png" alt = "email icon"/>
                <p>registrar@srmus.edu.in <br/>epravand@srmus.edu.in</p>
            </div>
        </div>

        {/* <!-- Location Section --> */}
        <div className="location">
            <h2> Location </h2>
            <div className="location_icon">
                <img src="/logos/Footer Location icon.png" alt = "location icon"/>
                <p>SRM University Sikkim <br/>5th Mile, Tadong<br/> Gangtok -737 102 , East Sikkim</p>
            </div>
        </div>

        {/* <!-- Meet Us At Section --> */}
        <div className="meet">
            <h2> Meet Us At </h2>
            <div className="linkedIn_icon">
                <img src = "/logos/LinedIn icon.png" alt = "linked in icon"/>
                <a href="https://www.linkedin.com/company/srmusikkim/">LinedIn</a>
            </div>
            <div className="google_icon">
                <img src = "/logos/Google Icon.png" alt = "google icon"/>
                <a href="https://www.linkedin.com/company/srmusikkim/">Google</a>
            </div>            
            <div className="facebook_icon">
                <img src = "/logos/Facebook Icon.png" alt = "facebook icon"/>
                <a href="https://www.facebook.com/SRMUSOfficial">Facebook</a>
            </div>            
        </div>
    </div>
    <hr/>
        <div className="copyright">
            <p>Copyright ©2024 SRMUS &nbsp;|&nbsp; Designed aand Developed by Gaurav Tamang & Roshan Chettri.</p>
        </div>
        </footer>
    ); 
};

export default Footer;