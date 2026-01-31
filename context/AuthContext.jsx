// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import {
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null); // Data dari Firestore
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRedirectResult(auth).catch(console.error);

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                // Ambil atau buat dokumen user di Firestore
                const userRef = doc(db, 'users', authUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    // Update last login tapi keep data lainnya
                    setUserData(userSnap.data());
                } else {
                    // Buat dokumen baru untuk user
                    const newUserData = {
                        uid: authUser.uid,
                        email: authUser.email,
                        displayName: authUser.displayName || 'Unknown',
                        playerName: authUser.displayName || 'Unknown', // Default sama dengan displayName
                        playerId: '', // Default kosong
                        photoURL: authUser.photoURL || '/default-profile.jpg',
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    };

                    await setDoc(userRef, newUserData);
                    setUserData(newUserData);
                }

                setUser(authUser);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            if (error.code === 'auth/popup-blocked') {
                console.error("Popup diblock");
            }
            throw error;
        }
    };

    const logout = () => signOut(auth);

    const refreshUserData = async () => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setUserData(userSnap.data());
            }
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            login,
            logout,
            loading,
            refreshUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);