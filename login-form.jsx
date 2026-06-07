import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function LoginForm({
  form,
  loading,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onFillDemo,
}) {
  return (
    <div className="w-full max-w-sm p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">

      {/* Branding */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">InvenTrack</h1>
        <p className="text-xs text-blue-300 font-medium uppercase tracking-widest">
          Inventory Management System
        </p>
        <div className="pt-2">
          <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-300">Sign in to continue</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-8">

        {/* Email */}
        <div className="relative z-0">
          <input
            type="email"
            id="floating_email"
            value={form.email}
            onChange={onEmailChange}
            required
            placeholder=" "
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer"
          />
          <label
            htmlFor="floating_email"
            className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <User className="inline-block mr-2 -mt-1" size={15} />
            Email Address
          </label>
        </div>

        {/* Password */}
        <div className="relative z-0">
          <input
            type={showPassword ? 'text' : 'password'}
            id="floating_password"
            value={form.password}
            onChange={onPasswordChange}
            required
            placeholder=" "
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer pr-8"
          />
          <label
            htmlFor="floating_password"
            className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <Lock className="inline-block mr-2 -mt-1" size={15} />
            Password
          </label>
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-0 top-2.5 text-gray-400 hover:text-white transition"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Sign In button */}
        <button
          type="submit"
          disabled={loading}
          className="group w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Signing in...
            </span>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Demo accounts */}
      <div className="pt-2 space-y-3">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-white/15" />
          <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider">
            Demo Accounts
          </span>
          <div className="flex-grow border-t border-white/15" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onFillDemo('admin')}
            className="flex flex-col items-center py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 rounded-xl text-white transition-all duration-200"
          >
            <span className="text-xs font-semibold text-blue-300">Admin Account</span>
            <span className="text-[10px] text-gray-400 mt-0.5">admin@inventory.com</span>
          </button>
          <button
            type="button"
            onClick={() => onFillDemo('staff')}
            className="flex flex-col items-center py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-white transition-all duration-200"
          >
            <span className="text-xs font-semibold text-gray-200">Staff Account</span>
            <span className="text-[10px] text-gray-400 mt-0.5">staff@inventory.com</span>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500">
          Select a role then click <span className="text-blue-400 font-medium">Sign In</span>
        </p>
      </div>

    </div>
  );
}
