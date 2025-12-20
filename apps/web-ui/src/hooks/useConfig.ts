import { useEffect, useState } from "react";

const MOBILE_WIDTH_PIXELS = 768;

function useConfig() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        isMobile: (width < MOBILE_WIDTH_PIXELS),
        screenWidth: width,
    };
};

export default useConfig;