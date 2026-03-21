import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Use your Service Role Key here for admin privileges on the backend
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const handleAuth=async(ws)=>{
    const token=ws.handshake.auth?.token;
    console.log("token",token);
    
    const {data:{user},error}= await supabase.auth.getUser(token);

    if (error || !user) {
        console.log("Fake or Expired Token! Disconnecting...");
        return ws.disconnect();
    }

    console.log("Authenticated User ID:", user.id);
}

