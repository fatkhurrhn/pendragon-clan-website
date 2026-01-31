// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

import {
    signInWithRedirect,
    onAuthStateChanged,
    signOut,
    getRedirectResult,
    GoogleAuthProvider
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Cek hasil redirect saat komponen mount
        getRedirectResult(auth)
            .then((result) => {
                console.log("Redirect result:", result); // DEBUG

                if (result) {
                    // Ini credential dari Google Access Token
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    const user = result.user;

                    console.log("Login sukses:", user?.email); // DEBUG
                    setAuthError(null);
                }
            })
            .catch((error) => {
                console.error("Error saat redirect:", error); // DEBUG
                setAuthError(error.message);

                // Handle error spesifik
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === 'auth/unauthorized-domain') {
                    console.error("Domain ini belum di-whitelist di Firebase Console!");
                } else if (errorCode === 'auth/cancelled-popup-request') {
                    console.error("Request dibatalkan");
                } else {
                    console.error("Error code:", errorCode, "Message:", errorMessage);
                }
            });

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed:", user?.email || "No user"); // DEBUG
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // const login = () => {
    //     setAuthError(null);
    //     console.log("Memulai login redirect..."); // DEBUG

    //     // Clear any pending redirects first
    //     googleProvider.setCustomParameters({
    //         prompt: 'select_account' // Force pilih akun setiap kali
    //     });

    //     signInWithRedirect(auth, googleProvider)
    //         .catch((error) => {
    //             console.error("Error memulai redirect:", error);
    //             setAuthError(error.message);
    //         });
    // };

    // import { signInWithPopup } from 'firebase/auth';
    const login = async () => {
        try {
            // Untuk testing sementara pakai popup
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Login sukses:", result.user);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const logout = () => {
        signOut(auth).then(() => {
            console.log("Logout sukses");
            setAuthError(null);
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, authError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);