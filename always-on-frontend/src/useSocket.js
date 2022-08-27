import io from 'socket.io-client';
import { useCallback, useRef } from 'react';

// friendReqListener takes in a callback (username) => void
// statusListener takes in a callback ({type: 'on' | 'off', username: string}) => void
export default function useSocket() {
    const socket = useRef(null);
    const friendReqListeners = useRef([]);
    const statusListeners = useRef([]);
    const connect = useCallback((token) => {
        if (socket.current) socket.current.close();
        if (!token) return;
        socket.current = io(process.env.REACT_APP_BACKEND.split('://')[1], { query: { token } });
        socket.current.on('connect', () => console.log('socket connected!'));
        socket.current.on('disconnect', () => console.log('socket disconnected!'));
        socket.current.on('friendReq', (data) => {
            friendReqListeners.current.forEach((listener) => listener(data));
        });
        socket.current.on('status', (data) => {
            statusListeners.current.forEach((listener) => listener(data));
        });
    }, []);
    const addFriendReqListener = useCallback((callback) => {
        friendReqListeners.current.push(callback);
    }, []);
    const removeFriendReqListener = useCallback((callback) => {
        friendReqListeners.current.splice(friendReqListeners.current.indexOf(callback), 1);
    }, []);
    const addStatusListener = useCallback((callback) => {
        statusListeners.current.push(callback);
    }, []);
    const removeStatusListener = useCallback((callback) => {
        statusListeners.current.splice(statusListeners.current.indexOf(callback), 1);
    }, []);
    return { connect, addFriendReqListener, removeFriendReqListener, addStatusListener, removeStatusListener };
}