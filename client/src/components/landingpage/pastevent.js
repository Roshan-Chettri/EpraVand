import React from "react";
import { Link } from "react-router-dom";

const PastEvent = (props) => {
    const maxLength = 200; // Adjust the maximum length to fit around 2-3 lines
    let description = props.description;


    if (description.length > maxLength) {
        description = description.slice(0, maxLength) + "...";
    }

    const defaultImage = "http://localhost:5000/uploads/default-image.png";

    return (
        <div className="past_event_1">
            <div className="past-image">
                <img src={props.imagePath ? `http://localhost:5000/${props.imagePath}` : defaultImage} alt="event" />
            </div>
            <div className="past_event_title_1">
                <h2>{props.title}</h2>
                <div className="description">
                    <p>
                        {description}
                    </p>
                </div>
                <div className="read_more">
                    <Link to={`/pastevents/${props.eventId}`}>
                        <button>View Details</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PastEvent;
