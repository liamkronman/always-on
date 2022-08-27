import io from 'socket.io-client';
import { useCallback, useRef } from 'react';

export default function useSocket() {
    const socket = useRef(null);
    const connect = useCallback((token) => {
        if (socket.current) socket.current.close();
        if (!token) return;
        socket.current = io(process.env.REACT_APP_BACKEND, { query: { token } });
        socket.current.on('connect', () => console.log('socket connected!'));
        socket.current.on('disconnect', () => console.log('socket disconnected!'));
    }, []);
    return { connect };
}