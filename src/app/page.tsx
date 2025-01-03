

// "use client"

// import { useState, useEffect } from 'react';
// import VideoCompanion from "@/components/VideoCompanion";
// import LoginForm from "@/components/LoginForm";

// export default function Home() {
//   const [user, setUser] = useState<string | null>(null);

//   // Check for existing user on load
//   // useEffect(() => {
//   //   const savedUser = localStorage.getItem('username');
//   //   if (savedUser) {
//   //     setUser(savedUser);
//   //   }
//   // }, []);
  
//   useEffect(() => {
//     try {
//       const savedUser = localStorage.getItem('username');
//       if (savedUser) {
//         setUser(savedUser);
//       }
//     } catch (error) {
//       console.error('Error accessing localStorage:', error);
//     }
//   }, []);

//   const handleLogin = (username: string) => {
//     setUser(username);
//     localStorage.setItem('username', username);
//   };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('username');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         <header className="text-center mb-12 relative">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             KdramaFix
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300">
//             React to your favorite scenes in real-time with other fans
//           </p>
//           {user && (
//             <div className="absolute right-0 top-0 flex items-center gap-2">
//               <span className="text-sm">Logged in as {user}</span>
//               <button 
//                 onClick={handleLogout}
//                 className="text-sm text-red-500 hover:text-red-600"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </header>
        
//         <div className="flex justify-center">
//           {user ? (
//             <VideoCompanion username={user} />
//           ) : (
//             <LoginForm onLogin={handleLogin} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// export default function Home() {
//   return (
//     <div>
//       <h1>Hello World</h1>
//     </div>
//   );
// }