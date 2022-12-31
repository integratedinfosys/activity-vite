import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { UserInfoContext } from '../utils/user-context';
type Props = {
    redirectPath?: string,
}
export default function GuestOnlyRoute({ redirectPath = '/welcome' }: Props) {
    const { session } = useContext(UserInfoContext);

    return (
        session ? <Navigate to={redirectPath} replace /> : <Outlet />
    )
}
