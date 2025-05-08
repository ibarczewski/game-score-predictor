import Link from "next/link";
import { useRouter } from "next/router";
import { getUserFromCookie, removeUserCookie } from "../lib/auth";
import { useState, useEffect } from "react";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromCookie = getUserFromCookie();
    setUser(userFromCookie);
  }, []);

  const handleLogout = () => {
    removeUserCookie();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Game Score Predictor
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.username}!</span>
              <Link href="/" className="hover:text-gray-300">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
