/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Volume2, VolumeX, Facebook, MapPin, Mail, Phone, Radio, Smartphone, Cross, HeartHandshake, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AUDIO_SOURCE = "https://cloudstream2032.conectarhosting.com/8186/stream";
const LOGO_URL = "/Icono512.png";
const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=co.ecoingenieria.radiobethelcr";
const WHATSAPP_URL = "https://wa.me/50670891457";

const Header = () => (
  <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
            <img 
            src={LOGO_URL} 
            alt="Radio Bethel Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/radio/100/100";
            }}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-bethel-blue leading-tight tracking-tight">RADIO BETHEL</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-bethel-red font-semibold">COSTA RICA</p>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
        <a href="#inicio" className="hover:text-bethel-blue transition-colors">Inicio</a>
        <a href="#nosotros" className="hover:text-bethel-blue transition-colors">Nosotros</a>
        <span
          aria-disabled="true"
          className="cursor-not-allowed text-stone-400/90"
          title="Próximamente"
        >
          Programación
        </span>
        <a href="#contacto" className="hover:text-bethel-blue transition-colors">Contacto</a>
      </nav>
      <a 
        href={ANDROID_APP_URL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-bethel-blue text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-bethel-blue/90 transition-all flex items-center gap-2 shadow-lg shadow-bethel-blue/20"
      >
        <Smartphone size={18} />
        <span className="hidden sm:inline">Descargar App</span>
      </a>
    </div>
  </header>
);

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [streamStatus, setStreamStatus] = useState<'idle' | 'loading' | 'playing' | 'offline'>('idle');
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
      setIsPlaying(false);
      setStreamStatus('idle');
      return;
    }

    setStreamStatus('loading');
    audioRef.current.play().catch(err => {
      console.error("Error playing audio:", err);
      setIsPlaying(false);
      setStreamStatus('offline');
    });
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume === 0) setIsMuted(true);
      else if (isMuted) setIsMuted(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handlePlaying = () => {
      setIsPlaying(true);
      setStreamStatus('playing');
    };

    const handlePause = () => {
      setIsPlaying(false);
      setStreamStatus(current => (current === 'offline' ? 'offline' : 'idle'));
    };

    const handleWaiting = () => {
      setStreamStatus(current => (current === 'playing' ? 'playing' : 'loading'));
    };

    const handleOffline = () => {
      setIsPlaying(false);
      setStreamStatus('offline');
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleOffline);
    audio.addEventListener('stalled', handleOffline);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleOffline);
      audio.removeEventListener('stalled', handleOffline);
    };
  }, [volume]);

  const statusLabel =
    streamStatus === 'playing'
      ? 'Conectado'
      : streamStatus === 'loading'
        ? 'Conectando'
        : streamStatus === 'offline'
          ? 'Señal fuera del aire'
          : 'Listo para reproducir';

  const statusTone =
    streamStatus === 'playing'
      ? 'text-emerald-600'
      : streamStatus === 'loading'
        ? 'text-amber-600'
        : streamStatus === 'offline'
          ? 'text-red-600'
          : 'text-stone-500';

  const statusDot =
    streamStatus === 'playing'
      ? 'bg-emerald-500 animate-ping'
      : streamStatus === 'loading'
        ? 'bg-amber-500 animate-pulse'
        : streamStatus === 'offline'
          ? 'bg-red-500'
          : 'bg-stone-400';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-200 z-[100] py-4 px-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            <div className={`w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center text-bethel-blue overflow-hidden shadow-inner p-1 ${isPlaying ? 'animate-pulse' : ''}`}>
              <img 
                src={LOGO_URL} 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <Radio size={28} className="absolute opacity-20" />
            </div>
            {isPlaying && (
              <div className="absolute -top-1 -right-1 flex gap-0.5">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-bethel-red rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-bethel-red uppercase tracking-widest mb-0.5">En Vivo</p>
            <h3 className="text-base font-serif font-bold text-stone-900 leading-tight">Radio Bethel Costa Rica</h3>
            <p className="text-xs text-stone-500">Transmitiendo desde Siquirres, Limón</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={togglePlayback}
            className="w-14 h-14 bg-bethel-blue text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-bethel-blue/30"
            aria-label={isPlaying ? 'Detener transmisión' : 'Reproducir transmisión'}
          >
            {isPlaying ? <Square size={24} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
          </button>
          
          <div className="hidden md:flex items-center gap-3 w-40">
            <button onClick={toggleMute} className="text-stone-500 hover:text-bethel-blue transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-bethel-blue"
            />
          </div>
        </div>

        <div className="hidden lg:block text-right">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Señal Online</p>
          <div className={`flex items-center gap-2 font-semibold text-sm ${statusTone}`}>
            <span className={`w-2 h-2 rounded-full ${statusDot}`} />
            {statusLabel}
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={AUDIO_SOURCE} preload="none" />
    </div>
  );
};

const Hero = () => (
  <section id="inicio" className="relative pt-12 pb-24 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img
        src="/costa-rica-flag.svg"
        alt="Bandera de Costa Rica"
        className="w-full h-full object-cover scale-110 saturate-[1.35] contrast-110 blur-sm"
      />
      <div className="absolute inset-0 bg-white/52 backdrop-blur-md z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-bethel-blue/12 via-transparent to-bethel-red/12 z-10" />
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 bg-bethel-red/10 text-bethel-red text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-6">
            Siquirres, Limón • Costa Rica
          </span>
          <h2 className="text-5xl sm:text-7xl font-serif font-bold text-stone-900 leading-[1.1] mb-8">
            Una Emisora <br/>
            <span className="text-bethel-blue italic">Bendiciendo</span> <br/>
            a Costa Rica
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed mb-10 max-w-xl">
            Transmitiendo esperanza, fe y comunidad. Radio Bethel es un espacio dedicado a compartir música, reflexión y mensajes que fortalecen los valores en la familia.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#nosotros" className="px-8 py-4 bg-white text-stone-900 border border-stone-200 rounded-xl font-bold hover:bg-stone-50 transition-all">
              Conocer Más
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
            <img 
              src="/imagen-hero.jpeg" 
              alt="Radio Bethel Costa Rica" 
              className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl p-2 mb-4 border border-white/30">
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <p className="text-white/80 text-sm font-medium mb-2 italic">"Transmitiendo esperanza, fe y comunidad"</p>
              <h4 className="text-white text-2xl font-serif font-bold">Radio Bethel Costa Rica</h4>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-bethel-red/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-bethel-blue/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="nosotros" className="scroll-mt-24 py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-6">Nuestra Misión</h2>
        <div className="w-20 h-1 bg-bethel-red mx-auto mb-8 rounded-full" />
        <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
          Radio Bethel Costa Rica es un espacio de comunicación dedicado a compartir música, reflexión y mensajes de esperanza para la comunidad.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-12">
        {[
          {
            title: "Fortalecer la Fe",
            desc: "Buscamos acompañar a las personas con una programación que fortalezca la fe y promueva valores positivos.",
            icon: <Cross className="text-bethel-blue" size={32} />
          },
          {
            title: "Inspiración Familiar",
            desc: "Creamos un ambiente de inspiración para toda la familia con contenido pensado para edificar y animar.",
            icon: <HeartHandshake className="text-bethel-blue" size={32} />
          },
          {
            title: "Propósito Diario",
            desc: "Conectamos a las personas con palabras que aportan tranquilidad y propósito en su vida diaria.",
            icon: <Compass className="text-bethel-blue" size={32} />
          }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-bethel-blue/20 hover:shadow-xl transition-all group"
          >
            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4">{item.title}</h3>
            <p className="text-stone-600 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const AppDownload = () => (
    <section
      className="py-24 text-white overflow-hidden relative bg-stone-950 bg-cover bg-center"
      style={{ backgroundImage: "url('/app-section-bg.svg')" }}
    >
      <div className="absolute inset-0 bg-stone-950/58 backdrop-blur-[2px]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-bethel-blue/10 skew-x-12 translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-8 leading-tight">
                Lleve la Bendición <br/>
                <span className="text-bethel-red">en su Bolsillo</span>
              </h2>
              <p className="text-stone-400 text-lg mb-10 leading-relaxed">
                Descargue nuestra aplicación oficial para Android y manténgase conectado con nuestra programación en vivo, reciba notificaciones de transmisiones especiales y fortalezca su fe en cualquier lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <a 
                  href={ANDROID_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-white text-stone-900 px-8 py-4 rounded-2xl font-bold hover:bg-stone-100 transition-all group"
                >
                  <div className="bg-stone-900 text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M3.5 2.5L13.8 12L3.5 21.5L3 21L2.5 3L3.5 2.5Z" fill="#00D26A" />
                      <path d="M13.8 12L17.1 8.95L21.2 11.25C21.95 11.67 21.95 12.33 21.2 12.75L17.1 15.05L13.8 12Z" fill="#FFD84D" />
                      <path d="M3.5 2.5L17.1 8.95L13.8 12L3.5 2.5Z" fill="#00A6F6" />
                      <path d="M3.5 21.5L13.8 12L17.1 15.05L3.5 21.5Z" fill="#F44336" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest leading-none mb-1 opacity-60">Disponible en</p>
                    <p className="text-lg leading-none">Google Play</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-[520px] bg-stone-800 rounded-[3rem] border-[8px] border-stone-700 shadow-2xl overflow-hidden relative">
                <img 
                  src="/captura1.png" 
                  alt="Captura de la aplicación Radio Bethel" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-bethel-red/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-bethel-blue/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
);

const Footer = () => (
  <footer id="contacto" className="scroll-mt-24 bg-stone-50 pt-24 pb-32 border-t border-stone-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-bethel-blue rounded-full flex items-center justify-center text-white p-1 overflow-hidden shadow-inner">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-bethel-blue leading-tight tracking-tight">RADIO BETHEL</h1>
              <p className="text-[8px] uppercase tracking-[0.2em] text-bethel-red font-semibold">COSTA RICA</p>
            </div>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed mb-8">
            Transmitiendo esperanza, fe y comunidad desde Siquirres, Limón. Una emisora dedicada a compartir música, reflexión y mensajes que fortalecen la fe.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61584990081292"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-bethel-blue hover:text-white hover:border-bethel-blue transition-all"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@radiobethelcr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-bethel-blue hover:text-white hover:border-bethel-blue transition-all"
              aria-label="TikTok"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M16.38 2H13.6v11.24a2.67 2.67 0 1 1-2.66-2.58c.2 0 .4.02.58.06V7.89a5.52 5.52 0 0 0-.58-.03A5.54 5.54 0 1 0 16.38 13V7.28A6.43 6.43 0 0 0 20.14 8.5V5.73A3.67 3.67 0 0 1 16.38 2Z" />
              </svg>
            </a>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=WYWX63VWWAZLS"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-bethel-blue hover:text-white hover:border-bethel-blue transition-all"
              aria-label="Donar con PayPal"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M9.26 4.5H15.2c2.8 0 4.45 1.44 4.04 4.05-.44 2.82-2.45 4.31-5.38 4.31h-1.94c-.46 0-.78.3-.85.75l-.67 4.39H6.9l1.57-10.2c.07-.45.39-.75.79-.75Z" fill="#253B80"/>
                <path d="M10.78 5.77c.08-.45.39-.75.79-.75h4.95c.59 0 1.13.05 1.61.16-.66-1.08-1.94-1.68-3.77-1.68H9.42c-.4 0-.72.3-.79.75L7.06 14.45h3.02l.7-4.56Z" fill="#179BD7"/>
                <path d="M18.84 9.16c-.63 2.91-2.95 4.45-5.9 4.45h-1.89c-.4 0-.72.29-.79.69l-.88 5.7-.25 1.62c-.05.31.19.59.51.59h3.13c.35 0 .64-.26.69-.6l.03-.17.59-3.74.04-.2c.05-.35.34-.6.69-.6h.43c2.8 0 4.99-1.14 5.63-4.45.27-1.38.13-2.53-.53-3.29-.2-.23-.44-.42-.73-.57-.07.19-.13.39-.17.57Z" fill="#253B80"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-stone-900 font-bold mb-8 uppercase tracking-widest text-xs">Enlaces Rápidos</h4>
          <ul className="space-y-4 text-sm text-stone-500">
            <li><a href="#inicio" className="hover:text-bethel-blue transition-colors">Inicio</a></li>
            <li><a href="#nosotros" className="hover:text-bethel-blue transition-colors">Nosotros</a></li>
            <li>
              <span
                aria-disabled="true"
                className="cursor-not-allowed text-stone-400/90"
                title="Próximamente"
              >
                Programación
              </span>
            </li>
            <li><a href="#contacto" className="hover:text-bethel-blue transition-colors">Contacto</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-stone-900 font-bold mb-8 uppercase tracking-widest text-xs">Contacto</h4>
          <ul className="space-y-6 text-sm text-stone-500">
            <li className="flex gap-4">
              <MapPin size={20} className="text-bethel-red shrink-0" />
              <span>Siquirres, Limón<br/>Costa Rica</span>
            </li>
            <li className="flex gap-4">
              <Mail size={20} className="text-bethel-red shrink-0" />
              <span>contacto@radiobethelcr.com</span>
            </li>
            <li className="flex gap-4">
              <Phone size={20} className="text-bethel-red shrink-0" />
              <span>+50670891457</span>
            </li>
          </ul>
        </div>
        
      </div>
      
      <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400">
        <p>© {new Date().getFullYear()} Radio Bethel Costa Rica. Todos los derechos reservados.</p>
        <p>
          Desarrollo web por{' '}
          <a
            href="https://ecoingenieria.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-bethel-blue hover:text-bethel-red transition-colors"
          >
            Ecoingeniería
          </a>
        </p>
      </div>
    </div>
  </footer>
);

const WhatsAppButton = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Contactar por WhatsApp"
    className="fixed right-5 bottom-28 z-[110] drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95"
  >
    <svg
      width="68"
      height="68"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M32 6C18.74 6 8 16.36 8 29.14c0 4.67 1.44 8.99 3.9 12.6L8 56l14.98-3.8A24.4 24.4 0 0 0 32 54c13.26 0 24-10.36 24-23.14C56 16.36 45.26 6 32 6Z"
        fill="white"
      />
      <path
        d="M32 10.5c-10.7 0-19.38 8.3-19.38 18.54 0 3.98 1.32 7.66 3.57 10.66l-2.27 8.17 8.54-2.18a19.86 19.86 0 0 0 9.54 2.43c10.7 0 19.38-8.3 19.38-18.54S42.7 10.5 32 10.5Z"
        fill="#57B657"
      />
      <path
        d="M26.72 21.85c-.45-1.02-.92-1.04-1.35-1.06-.35-.02-.74-.02-1.14-.02-.39 0-1.04.14-1.59.69-.55.55-2.08 2-2.08 4.88 0 2.88 2.13 5.66 2.42 6.05.29.39 4.07 6.39 10.05 8.7 4.97 1.92 5.99 1.53 7.07 1.43 1.08-.1 3.48-1.38 3.97-2.71.49-1.33.49-2.47.35-2.71-.15-.24-.55-.39-1.14-.69-.59-.29-3.48-1.69-4.02-1.88-.55-.2-.94-.29-1.34.29-.39.6-1.53 1.88-1.88 2.28-.35.39-.7.45-1.29.15-.59-.29-2.51-.91-4.79-2.91-1.77-1.56-2.96-3.48-3.31-4.08-.35-.6-.04-.92.26-1.21.27-.26.6-.69.89-1.03.29-.35.39-.6.59-.99.19-.39.1-.74-.05-1.04-.15-.29-1.34-3.17-1.88-4.38Z"
        fill="white"
        transform="translate(3 2) scale(0.8)"
      />
    </svg>
  </a>
);

export default function App() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-bethel-blue/10 selection:text-bethel-blue">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <AppDownload />
      </main>
      <Footer />
      <WhatsAppButton />
      <AudioPlayer />
    </div>
  );
}
