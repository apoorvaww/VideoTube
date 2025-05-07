import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export const Subscription = () => {
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [loading, setLoading] = useState(true);

    const subscriberId = useParams();

    const backendURL = "http://localhost:8000";

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const channels = async() => {
            setLoading(true);
            try {
                const res = await axios.get(`${backendURL}/api/subscription/subscribed-channels/${subscriberId}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )
                console.log(res.data);
                setSubscribedChannels(res.data.data);
            } catch (error) {
                console.log("Error in fetching the subscribed channels: ", error);
            }
        }
    }, [subscriberId])




    return(
        <>

        <div>
            <p>Total Subscribed Channels: </p>
        </div>
        
        </>
    )

}