import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-screen bg-blue-100">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Poll/Room
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="font-medium hover:text-blue-600">
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="max-w-4xl mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
