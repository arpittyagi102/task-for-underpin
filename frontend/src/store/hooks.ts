import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useEffect } from 'react';
import { validateToken } from "@/services/auth";
import { setUser, clearUser } from "@/store/slices/userSlice"
import { setBanana } from "./slices/bananaSlice";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useInitializeAuth = () => {
    const dispatch = useDispatch();

    const initializeAuth = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            const response = await validateToken(token);
            if (response.success && response.user) {
                dispatch(setUser(response.user));
                dispatch(setBanana(response.user.bananaCount || 0));
            }
        } else {
            dispatch(clearUser());
        }
    }

    useEffect(() => {
        initializeAuth();
    }, []);
}
