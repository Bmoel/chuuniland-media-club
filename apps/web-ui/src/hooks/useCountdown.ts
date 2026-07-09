import { useSyncExternalStore, useCallback, useEffect, useRef } from "react";

export default function useCountdown(seconds: number | null): number | null {
    const valueRef = useRef(seconds);
    const listenersRef = useRef(new Set<() => void>());

    const subscribe = useCallback((listener: () => void) => {
        listenersRef.current.add(listener);
        return () => { listenersRef.current.delete(listener); };
    }, []);

    const getSnapshot = useCallback(() => valueRef.current, []);

    useEffect(() => {
        valueRef.current = seconds;
        listenersRef.current.forEach((l) => l());

        if (seconds === null || seconds <= 0) return;

        const interval = setInterval(() => {
            const prev = valueRef.current;
            if (prev === null || prev <= 1) {
                valueRef.current = 0;
                clearInterval(interval);
            } else {
                valueRef.current = prev - 1;
            }
            listenersRef.current.forEach((l) => l());
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    return useSyncExternalStore(subscribe, getSnapshot);
}