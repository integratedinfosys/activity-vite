import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { UserInfoContext, UserInfo } from "./utils/user-context";
import { toast, ToastContainer } from 'react-toastify'
import { supabase } from "./utils/supabaseClient";

import 'react-toastify/dist/ReactToastify.css';

export default function App() {

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({ session: null, isSessionReady: false })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserInfo({ session, isSessionReady: true })
    })
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserInfo({ session, isSessionReady: true })
      if (_event == "PASSWORD_RECOVERY") {
        navigate("/forgot-password-new-password")
      } else {
        if (session) {
          // navigate("/welcome")
        } else {
          toast("Logging Out, bye!")
          // navigate("/")
        }
      }
    })
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <UserInfoContext.Provider value={userInfo}>

        <AppRoutes />
        <ToastContainer position="bottom-right" />

      </UserInfoContext.Provider>
    </>
  )
}