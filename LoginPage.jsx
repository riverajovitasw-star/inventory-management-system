import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SmokeyBackground } from '../components/ui/SmokeyBackground';
import { LoginForm } from '../components/ui/login-form';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setForm({ email: 'admin@inventory.com', password: 'admin123' });
    } else {
      setForm({ email: 'staff@inventory.com', password: 'staff123' });
    }
  };

  return (
    <main className="relative w-screen h-screen bg-gray-950 overflow-hidden">
      {/* Animated WebGL smokey background */}
      <SmokeyBackground
        color="#1E3A8A"
        backdropBlurAmount="sm"
        className="absolute inset-0"
      />

      {/* Centered login form */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <LoginForm
          form={form}
          loading={loading}
          showPassword={showPassword}
          onEmailChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          onPasswordChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          onTogglePassword={() => setShowPassword((s) => !s)}
          onSubmit={handleSubmit}
          onFillDemo={fillDemo}
        />
      </div>
    </main>
  );
}
