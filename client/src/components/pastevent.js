import React from "react";

const PastEvent = (props) => {
    return (
        <div className="past_event_1">
                    <div className="dance_image">
                        <img src= {props.imagePath} alt="event"/>
                    </div>
                    <div className="past_event_title_1">
                        <h2>{props.title}</h2>
                    </div>    
                    <div className="description">
                        <p>
                            {props.description}
                        </p>
                    </div>  
                    <div className="read_more">
                        <a href="#">Read More...</a>
                    </div>              
                </div>
    );
};

export default PastEvent;