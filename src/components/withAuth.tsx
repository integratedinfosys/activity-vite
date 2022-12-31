import React, { ComponentType, FC, useContext } from 'react';
import Login from '../pages/Auth/Login'
import { UserInfoContext } from '../utils/user-context'

const withAuth = <P extends object>(
    Component: ComponentType<P>,
): FC<P> => {
    return ({ ...props }) => {
        const { session, isSessionReady } = useContext(UserInfoContext);
        return (
            isSessionReady && !session ? <Login /> : <Component {...props as P} />
        );
    };
};

export default withAuth;

