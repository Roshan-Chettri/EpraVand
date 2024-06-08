import React from "react";

const Event = (props) => {
    let description = props.description;
    let readMoreText = null;

    if (description.length > 390) {
        let lastSpaceIndex = description.lastIndexOf(" ", 390); // Find the last space before 312 characters
        if (lastSpaceIndex !== -1) {
            description = description.slice(0, lastSpaceIndex);
        } else {
            description = description.slice(0, 390); // If no space found, cut at 312 characters
        }
        readMoreText = <a href="#" className="read-more"> Read more...</a>;
    }

    return (
        <div className="events">
            {/* For Event 01 sample image 01 */}
            <div className="image">
                {console.log(props.imagePath)}
                <img src={"http://localhost:5000/" + props.imagePath} alt="event" />
            </div>
            {/* Event Title */}
            <div className="content">
                <h2> {props.title} </h2>

                {/* Event Description */}
                <div className="description">
                    <p>
                        {description}
                        {readMoreText}
                    </p>
                </div>
                {/* Event Date */}
                <div className="extra_details">
                    <div className="date">
                        <img src="/logos/Calender Icon.png" alt="Calendar Icon" />
                        <h3> {props.date}</h3>
                    </div>
                    {/* Event Venue */}
                    <div className="venue">
                        <img src="/logos/location Icon.png" alt="location icon" />
                        <h3>{props.venue}</h3>
                    </div>
                    {/* Event View Details button */}
                    <div className="view_details">
                        <button>View Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;
