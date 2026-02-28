import { useEffect, useRef, useState } from "react";

const MOBILE_WIDTH_PIXELS = 768;

function useConfig() {
    const [width, setWidth] = useState(window.innerWidth);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setWidth(window.innerWidth), 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return {
        isMobile: (width < MOBILE_WIDTH_PIXELS),
        screenWidth: width,
    };
};

export default useConfig;