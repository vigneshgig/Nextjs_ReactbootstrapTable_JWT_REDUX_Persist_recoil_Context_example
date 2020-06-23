import { atom } from 'recoil'

export const loggedInUserData = atom({
    key: "loggedInUserData",
    default: {
        username: 'vignesh'
    }
});