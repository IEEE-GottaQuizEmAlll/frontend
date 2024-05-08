import React from "react";

function Footer(props) {
    return (
        <>
            <div className={`h-12 flex items-center justify-center bg-${props.color} font-raleway font-bold`}>
                Made by IEEE | GottaQuizEmAll
            </div>
        </>
    );
}

export default Footer;
