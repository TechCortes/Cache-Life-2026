import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { clearToken, readToken, writeToken } from "./access-token";

export const useAfterglowAccess = () => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    setAuthorized(readToken() !== null);
    setChecking(false);
  }, []);

  const login = useCallback(async (password: string) => {
    const { data, error } = await supabase.functions.invoke(
      "verify-afterglow-access",
      { body: { password } },
    );
    if (error || !data?.token || !data?.exp) {
      throw new Error("Invalid password");
    }
    writeToken({ token: data.token as string, exp: data.exp as number });
    setAuthorized(true);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAuthorized(false);
  }, []);

  return { authorized, checking, login, logout };
};
