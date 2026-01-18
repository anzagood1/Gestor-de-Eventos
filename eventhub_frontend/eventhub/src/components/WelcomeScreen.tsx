import { useState } from 'react';
import { Calendar, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { login, register } from "../api/auth";


interface WelcomeScreenProps {
  onLogin: (email: string, name: string) => void;
}

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        toast.success("¡Bienvenido!");
        onLogin(user.email, user.userName);
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Las contraseñas no coinciden");
          return;
        }

        await register(formData.name, formData.email, formData.password);
        toast.success("Cuenta creada correctamente");
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1505845753232-f74a87b62db6?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Eventhub Background"
      className = "fixed inset-0 w-full h-full object-cover brightness-25 object-center"
      />
    <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">        {/* Left Side - Branding */}
        <div className="text-white space-y-6 lg:pr-12">
          <div className="flex items-center gap-4">
            <div className="bg-white p-4 rounded-2xl">
              <Calendar className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-white">EventHub</h1>
          </div>
          
          <h2 className="text-white">
            Organiza y descubre eventos increíbles
          </h2>
          
          <p className="text-blue-100 text-lg">
            Conecta con personas, crea experiencias memorables y participa en los eventos más emocionantes de tu comunidad.
          </p>

          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white">Crea Eventos</h4>
                <p className="text-blue-100 text-sm">Organiza tus propios eventos fácilmente</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white">Inscríbete</h4>
                <p className="text-blue-100 text-sm">Participa en eventos de tu interés</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white">Gestiona</h4>
                <p className="text-[blue-100] text-sm">Administra tus inscripciones en un solo lugar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-gray-900 mb-2 font-bold text-3xl">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Bienvenido de nuevo, ingresa tus credenciales' 
                : 'Completa el formulario para comenzar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
              {' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                  });
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button className="text-sm text-gray-500 hover:text-gray-700">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}