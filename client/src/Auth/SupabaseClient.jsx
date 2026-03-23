import { useState, useEffect } from "react";
import { SignupForm } from "@/components/Signup";
import { toast } from "sonner";
import { LoginForm } from "@/components/login-form";

const Authclient=({supabase,createSocketConnection})=>{
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [login,setLogin]=useState(true);

const handleSocialAuth=async()=>{
    const { data, error } = await supabase.auth.signInWithOAuth({
  provider:'google',
  options: {
    redirectTo: `http://localhost:5173`,
  },
})
       if (error) {
        console.error("SUPABASE ERROR:", error.message); // THIS WILL TELL US THE REASON
        toast.error(error.message);
    } else  if(data) {
        console.log("SUCCESS DATA:", data);
    } 
}

   const handleloginWithPassword=async(e)=>{
             e.preventDefault();
             const {data,error}=await supabase.auth.signInWithPassword({
                 email:email,
                password:password,
                options: {
                shouldCreateUser: false,
               emailRedirectTo: 'http://localhost:5173',
             },
            })
               if (error) {
        console.error("SUPABASE ERROR:", error.message); // THIS WILL TELL US THE REASON
        toast.error(error.message);
    } else  if(data) {
        console.log("SUCCESS DATA:", data);
        toast.success("Login Successfully");
    }}
    const handleLoginWithMagicLink=async()=>{
      const {data,error}= await supabase.auth.signInWithOtp({
    email:email,
    password:password,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
      emailRedirectTo: 'http://localhost:5173',
    },
  })
    if (error) {
        console.error("SUPABASE ERROR:", error.message); // THIS WILL TELL US THE REASON
        toast.error(error.message);
    } else  if(data) {
        console.log("SUCCESS DATA:", data);
    }
  }
    // const handleLogin=(e)=>{
    //     e.preventDefault();
    //     // console.log("event",e)
    // // console.log("data",data)
    //  createSocketConnection(data);
    // }
    const handleSignupWithPassword=async(e)=>{
        e.preventDefault();
        console.log("event",e)
        const {data,error}=await supabase.auth.signUp({
            email:email,
            password:password,
            options: {
           emailRedirectTo: 'http://localhost:5173',
         },
        })
   if (error) {
        console.error("SUPABASE ERROR:", error.message); // THIS WILL TELL US THE REASON
        toast.error(error.message);
    } else  if(data) {
        console.log("SUCCESS DATA:", data);
    }
    // console.log("data",data)
    createSocketConnection(data);
    }

    return(
        <div className="w-full h-screen bg-gray-400 ">
            <div className=" flex flex-col ml-56 mr-34">
                {login ? (
                    <>
                    <h1 className="text-5xl fon font-serif mb-23">Login Page</h1>
                    <LoginForm setEmail={setEmail} email={email}           
                    setPassword={setPassword} handleloginWithPassword={handleloginWithPassword} 
                    handleLoginWithMagicLink={handleLoginWithMagicLink} setLogin={setLogin}
                    handleSocialAuth={handleSocialAuth} />
                    </>     
                ):( 
                    <>
                    <h1 className="text-5xl fon font-serif mb-4">Signup Page</h1>
                    <SignupForm name={name} setName={setName} setEmail={setEmail} email={email}           
                    setPassword={setPassword} handleSignupWithPassword={handleSignupWithPassword}
                     setLogin={setLogin} handleSocialAuth={handleSocialAuth}/>
                    </>
                )}
            </div>
        </div>
    )
}

export default Authclient



















// import { useState, useEffect } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { LoginForm } from "@/components/login-form";
// import { toast } from "sonner";

// const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
// export default function Authclient({setCheckPoint}) {
//     const [loading, setLoading] = useState(false);
//     const [email, setEmail] = useState("");
//     const [claims, setClaims] = useState(null); 

//     // Check URL params on initial render
//     const params = new URLSearchParams(window.location.search);
//     const hasTokenHash = params.get("token_hash");

//     const [verifying, setVerifying] = useState(!!hasTokenHash);
//     const [authError, setAuthError] = useState(null);
//     const [authSuccess, setAuthSuccess] = useState(false);

//     useEffect(() => {
//         // Check if we have token_hash in URL (magic link callback)
//         const params = new URLSearchParams(window.location.search);
//         const token_hash = params.get("token_hash");
//         const type = params.get("type");

//         if (token_hash) {
//             // Verify the OTP token
//             supabase.auth.verifyOtp({
//                 token_hash,
//                 type: type || "email",
//             }).then(({ error }) => {
//                 if (error) {
//                     setAuthError(error.message);
//                 } else {
//                     setAuthSuccess(true);
//                     getJWT();
//                     // Clear URL params
//                     window.history.replaceState({}, document.title, "/");
//                 }
//                 setVerifying(false);
//             });
//         }

//         // Check for existing session using getClaims
//         supabase.auth.getClaims().then(({ data: { claims } }) => {
//             setClaims(claims);

//             setCheckPoint(true);
//         });

//         // Listen for auth changes
//         const {
//             data: { subscription },
//         } = supabase.auth.onAuthStateChange(() => {
//             supabase.auth.getClaims().then(({ data: { claims } }) => {
//                 setClaims(claims);
//                 setTimeout(()=>{
//                     setCheckPoint(true);
//                 },1500)
//             });
//         });

//         return () => subscription.unsubscribe();
//     }, []);
    
//     const handleLogin = async (event) => {
//         event.preventDefault();
//         setLoading(true);
//         const { error } = await supabase.auth.signInWithOtp({
//             email,
//             options: {
//                 emailRedirectTo: window.location.origin,
//             }
//         });
//         if (error) {
//             // alert(error.error_description || error.message);
//            toast.error("something wrong")
//         } else {
//             alert("Check your email for the login link!");
//              toast.success("Check your mail")
//             }
//         setLoading(false);
//     };

//     const handleLogout = async () => {
//         await supabase.auth.signOut();
//         setClaims(null);
//         setCheckPoint(false);
//           toast.success("Logout Sucessfully")}
    
//     // Show verification state
//     if (verifying) {
//         return (
//             <div>
//                 <h1>Authentication</h1>
//                 <p>Confirming your magic link...</p>
//                 <p>Loading...</p>
//             </div>
//         );
//     }

//     // Show auth error
//     if (authError) {
//         return (
//             <div>
//                 <h1>Authentication</h1>
//                 <p>✗ Authentication failed</p>
//                 <p>{authError}</p>
//                 <button
//                     onClick={() => {
//                         setAuthError(null);
//                         window.history.replaceState({}, document.title, "/");
//                     }}
//                 >
//                     Return to login
//                 </button>
//             </div>
//         );
//     }

//     // Show auth success (briefly before claims load)
//     if (authSuccess && !claims) {
//         return (
//             <div>
//                 <h1>Authentication</h1>
//                 <p>✓ Authentication successful!</p>
//                 <p>Loading your account...</p>
//             </div>
//         );
//     }

//     // If user is logged in, show welcome screen
//     if (claims) {
//         return (
//             <div>
//                 <h1>Welcome!</h1>
//                 <p>You are logged in as: {claims.email}</p>
//                 <button onClick={handleLogout}>
//                     Sign Out
//                 </button>
//             </div>
//         );
//     }


//     const getJWT=async()=>{
//       const {data:{session}}=await supabase.auth.getSession();
//        const jwt=session?.access_token;
//        console.log("Access_Token",jwt);
//        return jwt;
//     }

//     // Show login form
//     return (
//         <div className="bg-gray-500 text-white h-screen">
//        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//             <h1 className="text-5xl text-black font-extrabold font-serif">EditorVerse</h1>
//             <h2 className="text-5xl text-black font-extrabold mb-12 font-serif">Login</h2>
//         <LoginForm loading={loading} email={email} setEmail={setEmail} handleLogin={handleLogin}/>
//       </div>
//     </div>

//               {/* <p>Sign in via magic link with your email below</p>
//             <div className="bg-gray-500 text-white">
//             <form onSubmit={handleLogin}>
//                 <input
//                     type="email"
//                     placeholder="Your email"
//                     value={email}
//                     required={true}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <button disabled={loading}>
//                     {loading ? <span>Loading</span> : <span>Send magic link</span>}
//                 </button>
//             </form>
//             </ div> */}
//         </div>
//     );
// }