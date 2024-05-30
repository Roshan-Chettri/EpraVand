import React from "react";

const Event = (props) => {
    return(
        <div className = "events">
                {/* <!-- For Event 01 sample image 01 --> */}
                <div className ="image">
                    <img src={props.imagePath} alt = "event"/>
                </div>
                {/* <!-- Event Title --> */}
                <div className ="content">
                    <h2> {props.title} </h2>
                
                {/* <!-- Event Description --> */}
                <div className ="description">
                    <p>
                        {props.description}
                    </p>
                </div>
                {/* <!-- Event Date --> */}
                <div className="extra_details">
                <div className="date">
                    <img src="/logos/Calender Icon.png" alt="Calendar Icon" />
                    <h3> {props.date}</h3>
                </div>
                {/* <!-- Event Venue --> */}
                <div className ="venue">
                    <img src="/logos/location Icon.png" alt="location icon"/>
                    <h3>{props.venue}</h3>
                </div>
                {/* <!-- Event View Details button --> */}
                <div className ="view_details">
                    <button>View Details</button>
                </div>
                </div>
                </div>
        </div>

    );
};

export default Event;