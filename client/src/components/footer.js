import React from "react";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="footer">
        <div className="contact">
            <h2> Contact </h2>
            <div className="call_icon">
                <img src="logos/Contact icon.png" alt = "contact icon"/>
                <p>12345 - 67890 <br/> 09876 - 54321</p>
            </div>
            <div className="email">
                <img src="logos/Email icon.png" alt = "email icon"/>
                <p>lorem.ipsum@gamil.com <br/> epravand@gmailName.com</p>
            </div>
        </div>

        {/* <!-- Location Section --> */}
        <div className="location">
            <h2> Location </h2>
            <div className="location_icon">
                <img src="logos/Footer Location icon.png" alt = "location icon"/>
                <p>Lorem ipsum, ispum Lorem</p>
            </div>
        </div>

        {/* <!-- Meet Us At Section --> */}
        <div className="meet">
            <h2> Meet Us At </h2>
            <div className="linkedIn_icon">
                <img src = "logos/LinedIn icon.png" alt = "linked in icon"/>
                <p>Lorem ipsum</p>
            </div>
            <div className="google_icon">
                <img src = "logos/Google Icon.png" alt = "google icon"/>
                <p>Lorem ipsum</p>
            </div>            
            <div className="facebook_icon">
                <img src = "logos/Facebook Icon.png" alt = "facebook icon"/>
                <p>Lorem ipsum</p>
            </div>            
        </div>
    </div>

        </footer>
    ); 
};

export default Footer;