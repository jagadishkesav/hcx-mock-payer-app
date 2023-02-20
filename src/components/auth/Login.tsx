import { useAuthActions } from "../../recoil/actions/auth.actions";
import logo from "../../swasth_logo.png";

export default function Login() {

  const { login } = useAuthActions();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-row items-center justify-center w-full h-full">
        <div className="hidden lg:flex flex-col items-start justify-center p-20 w-1/3 h-full text-white bg-gray-400 ">
          <img className="h-16 mb-12" src={logo} alt="logo" />
          <h1 className="text-6xl font-bold">Welcome Back!</h1>
          <p className="text-2xl font-bold">Please login to your account.</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full lg:w-2/3 h-full">
          <form
            className="flex flex-col items-center justify-center w-3/4 md:w-1/2 lg:w-1/3 h-2/3"
            onSubmit={(e: { preventDefault: () => void; target: any }) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              login(email, password);
            }}
          >
            <img className="h-16 mb-12 block lg:hidden" src={logo} alt="logo" />
            <input
              className="w-full h-12 px-3 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="email"
              name="email"
              placeholder="Email"
            />
            <input
              className="w-full h-12 px-3 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="password"
              name="password"
              placeholder="Password"
            />
            <button
              className="w-full h-12 px-3 mb-4 text-base text-white bg-blue-500 border rounded-lg focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
