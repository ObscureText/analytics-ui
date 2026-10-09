import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserApi } from "../api/analyticsApi";
import { getStoredToken } from "../api/axiosClient";
import FullScreenLoader from "../components/Loader/FullScreenLoader";

export const RootLoader: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuthAndNavigate = async () => {
            const token = getStoredToken();
            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                const user = await getUserApi();
                if (user && user.email) {
                    navigate("/dashboard", {
                        state: { email: user.email },
                        replace: true,
                    });
                } else {
                    navigate("/login", { replace: true });
                }
            } catch (err) {
                navigate("/login", { replace: true });
            }
        };

        verifyAuthAndNavigate();
    }, [navigate]);

    return <FullScreenLoader message="Authenticating session..." />;
};

export default RootLoader;
