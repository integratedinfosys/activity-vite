import { Session } from "@supabase/supabase-js";
import { createContext } from "react";
export interface UserInfo {
    session: Session | null;
    isSessionReady: boolean;
  }

export const UserInfoContext = createContext<UserInfo>({
    session:null,
    isSessionReady: false
});
