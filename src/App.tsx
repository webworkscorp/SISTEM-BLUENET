/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import { 
    LayoutDashboard, Users, Package, DollarSign, FileText, Settings, 
    Bell, MessageSquare, LogOut, Search, Plus, MoreVertical, 
    ChevronRight, ChevronLeft, ArrowLeft, CheckCircle, CheckCircle2, AlertTriangle, Save, Clock, File, Lock, Copy, ExternalLink,
    Upload, Trash2, Edit2, User, Building, Phone, Mail, MapPin, Briefcase,
    CheckSquare, X, FileImage, FileSpreadsheet, FileVideo, FileAudio, FileArchive, FileCode, FileType2,
    HelpCircle, Wifi, Camera, Info, Calendar, Crown, Sparkles, ShieldCheck
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import { Joyride } from 'react-joyride';
import { OnboardingRobot } from './components/OnboardingRobot';

// --- ILUSTRACIONES DE ESTADO VACÍO PERSONALIZADAS POR SECCIÓN ---

// 1. Gráfica de Flujo Financiero
const EmptyChartIllustration = ({ 
    title = "Sin Datos Financieros", 
    description = "Aún no hay transacciones registradas para calcular la tendencia mensual." 
}: { title?: string, description?: string }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-stagger">
        <div className="relative w-44 h-32 mb-3 flex items-center justify-center">
            <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="160" height="90" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="10" y1="35" x2="170" y2="35" stroke="#EDF2F7" strokeDasharray="3 3" />
                <line x1="10" y1="60" x2="170" y2="60" stroke="#EDF2F7" strokeDasharray="3 3" />
                <line x1="10" y1="85" x2="170" y2="85" stroke="#EDF2F7" strokeDasharray="3 3" />
                
                <rect x="25" y="65" width="12" height="20" rx="2" fill="#CBD5E1" opacity="0.4" />
                <rect x="50" y="45" width="12" height="40" rx="2" fill="#CBD5E1" opacity="0.5" />
                <rect x="75" y="70" width="12" height="15" rx="2" fill="#CBD5E1" opacity="0.3" />
                <rect x="100" y="35" width="12" height="50" rx="2" fill="#203E71" opacity="0.15" />
                <rect x="125" y="55" width="12" height="30" rx="2" fill="#CBD5E1" opacity="0.4" />
                <rect x="150" y="40" width="12" height="45" rx="2" fill="#CBD5E1" opacity="0.3" />

                <path d="M 31 65 Q 56 35, 81 70 T 131 45 T 156 35" stroke="#203E71" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" opacity="0.4" />
                <circle cx="131" cy="45" r="4" fill="#203E71" />
            </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed">{description}</p>
    </div>
);

// 2. Gráfica de Pie / Distribución de Servicios
const EmptyPieIllustration = ({ 
    title = "Sin Distribución de Servicios", 
    description = "Asigna servicios a tus clientes para visualizar el desglose por categoría." 
}: { title?: string, description?: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center animate-stagger">
        <div className="relative w-36 h-36 mb-3 flex items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="70" cy="70" r="50" stroke="#E2E8F0" strokeWidth="12" fill="none" />
                <circle cx="70" cy="70" r="50" stroke="#203E71" strokeWidth="12" strokeDasharray="70 200" strokeDashoffset="-20" fill="none" opacity="0.25" strokeLinecap="round" />
                <circle cx="70" cy="70" r="50" stroke="#3A71BE" strokeWidth="12" strokeDasharray="40 200" strokeDashoffset="-105" fill="none" opacity="0.2" strokeLinecap="round" />
                <circle cx="70" cy="70" r="28" fill="#F8FAFC" />
                <path d="M70 55 V70 H85" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed">{description}</p>
    </div>
);

// 3. Directorio de Clientes
const EmptyClientsIllustration = ({ 
    title = "Sin Clientes Registrados", 
    description = "Agrega tu primer cliente para comenzar a gestionar servicios y contratos." 
}: { title?: string, description?: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-stagger">
        <div className="relative w-40 h-28 mb-3 flex items-center justify-center">
            <svg width="160" height="110" viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="15" width="120" height="70" rx="10" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="30" y="25" width="100" height="70" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                <circle cx="55" cy="52" r="12" fill="#E2E8F0" />
                <rect x="74" y="46" width="42" height="6" rx="3" fill="#94A3B8" opacity="0.8" />
                <rect x="74" y="56" width="28" height="5" rx="2.5" fill="#CBD5E1" />
                <circle cx="118" cy="37" r="4" fill="#203E71" opacity="0.6" />
            </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed">{description}</p>
    </div>
);

// 4. Servicios / Portafolio
const EmptyServicesIllustration = ({ 
    title = "Catálogo sin Servicios", 
    description = "No hay servicios agregados. Crea soluciones en tu catálogo de productos." 
}: { title?: string, description?: string }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-stagger">
        <div className="relative w-36 h-28 mb-3 flex items-center justify-center">
            <svg width="150" height="100" viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="20" width="100" height="60" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="35" y="32" width="24" height="24" rx="6" fill="#E2E8F0" />
                <rect x="67" y="35" width="48" height="6" rx="3" fill="#94A3B8" />
                <rect x="67" y="47" width="32" height="5" rx="2.5" fill="#CBD5E1" />
            </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 max-w-[270px] leading-relaxed">{description}</p>
    </div>
);

// 5. Gestor de Tareas
const EmptyTasksIllustration = ({ 
    title = "Sin Tareas Pendientes", 
    description = "No hay tareas pendientes en la lista de actividades." 
}: { title?: string, description?: string }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-stagger">
        <div className="relative w-36 h-28 mb-3 flex items-center justify-center">
            <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="15" width="80" height="70" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="50" cy="35" r="7" fill="#10B981" opacity="0.15" stroke="#10B981" strokeWidth="1.5" />
                <path d="M47 35 L49.5 37.5 L53.5 33" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="64" y="33" width="36" height="5" rx="2.5" fill="#94A3B8" />
                <circle cx="50" cy="55" r="7" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
                <rect x="64" y="53" width="28" height="5" rx="2.5" fill="#CBD5E1" />
            </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed">{description}</p>
    </div>
);

// 6. Auditoría / Logs
const EmptyLogsIllustration = ({ 
    title = "Sin Registros de Actividad", 
    description = "No se encontraron registros de auditoría ni eventos en este período." 
}: { title?: string, description?: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-stagger">
        <div className="relative w-36 h-28 mb-3 flex items-center justify-center">
            <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="100" height="60" rx="8" fill="#0F172A" opacity="0.04" stroke="#E2E8F0" strokeWidth="1.5" />
                <line x1="32" y1="38" x2="108" y2="38" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                <line x1="32" y1="52" x2="88" y2="52" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                <line x1="32" y1="66" x2="68" y2="66" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
            </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 max-w-[270px] leading-relaxed">{description}</p>
    </div>
);

// 7. Búsqueda
const EmptySearchIllustration = ({ 
    title = "Sin Coincidencias", 
    description = "No se encontraron resultados que coincidan con la búsqueda." 
}: { title?: string, description?: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-stagger">
        <div className="relative w-32 h-28 mb-3 flex items-center justify-center">
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="55" cy="45" r="28" stroke="#203E71" strokeWidth="3" fill="#F8FAFC" opacity="0.3" />
                <path d="M76 66 L98 88" stroke="#203E71" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
            </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed">{description}</p>
    </div>
);

// 8. Documentos / Archivos
const EmptyDocsIllustration = ({ 
    title = "Sin Archivos Adjuntos", 
    description = "Sube archivos o comprobantes asociados a este registro." 
}: { title?: string, description?: string }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-stagger">
        <div className="relative w-36 h-28 mb-3 flex items-center justify-center">
            <svg width="130" height="90" viewBox="0 0 130 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="15" width="80" height="60" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
                <path d="M55 45 L65 35 L75 45" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="65" y1="35" x2="65" y2="55" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed">{description}</p>
    </div>
);

const EmptyImageIllustration = EmptyDocsIllustration;

// 9. Cerrar Sesión / Spot Illustration
const LogoutSpotIllustration = () => (
    <div className="relative w-48 h-32 mb-2 flex items-center justify-center animate-stagger">
        <svg width="200" height="130" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoutBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF2F2" />
                    <stop offset="100%" stopColor="#FFF5F5" />
                </linearGradient>
                <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#203E71" />
                    <stop offset="100%" stopColor="#183059" />
                </linearGradient>
                <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
                <filter id="shadowLogout" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#991B1B" floodOpacity="0.14" />
                </filter>
                <filter id="shadowCard" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0F172A" floodOpacity="0.06" />
                </filter>
            </defs>

            {/* Background glow & decorative circles */}
            <circle cx="100" cy="65" r="56" fill="#FEF2F2" opacity="0.9" />
            <circle cx="100" cy="65" r="44" fill="#FEE2E2" opacity="0.45" />

            {/* Base Security Shield backdrop */}
            <rect x="48" y="22" width="104" height="86" rx="18" fill="url(#logoutBgGrad)" stroke="#FCA5A5" strokeWidth="1.5" filter="url(#shadowCard)" />

            {/* Door Frame */}
            <rect x="66" y="36" width="44" height="58" rx="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            
            {/* Perspective Open Door */}
            <path d="M 66 36 L 92 41 V 91 L 66 94 Z" fill="url(#doorGrad)" />
            <circle cx="87" cy="66" r="2" fill="#38BDF8" />

            {/* Arrow Badge floating out */}
            <g transform="translate(104, 50)" filter="url(#shadowLogout)">
                <circle cx="18" cy="18" r="18" fill="url(#accentGrad)" />
                <path d="M 12 18 H 24 M 19 13 L 24 18 L 19 23" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Lock badge on upper-left */}
            <g transform="translate(38, 42)" filter="url(#shadowCard)">
                <rect x="0" y="0" width="24" height="24" rx="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                <path d="M 8 11 V 8.5 A 4 4 0 0 1 16 8.5 V 11" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
                <rect x="6" y="11" width="12" height="9" rx="2.5" fill="#1E293B" />
                <circle cx="12" cy="15.5" r="1.3" fill="#FFFFFF" />
            </g>

            {/* Sparkles / Ambient particles */}
            <circle cx="164" cy="32" r="2.5" fill="#EF4444" opacity="0.7" />
            <circle cx="36" cy="26" r="2" fill="#94A3B8" opacity="0.5" />
            <circle cx="158" cy="100" r="3" fill="#FCA5A5" opacity="0.6" />
        </svg>
    </div>
);

// 10. Cambio Realizado con Éxito / Spot Illustration
const SuccessSpotIllustration = ({ className = "relative w-48 h-32 mb-2 flex items-center justify-center animate-stagger" }: { className?: string }) => (
    <div className={className}>
        <svg width="200" height="130" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="successBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ECFDF5" />
                    <stop offset="100%" stopColor="#F0FDF4" />
                </linearGradient>
                <linearGradient id="successBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="shadowSuccess" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#059669" floodOpacity="0.22" />
                </filter>
                <filter id="shadowSuccessCard" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#065F46" floodOpacity="0.06" />
                </filter>
            </defs>

            {/* Background glow & decorative circles */}
            <circle cx="100" cy="65" r="56" fill="#ECFDF5" opacity="0.9" />
            <circle cx="100" cy="65" r="44" fill="#D1FAE5" opacity="0.55" />

            {/* Main Card Backdrop */}
            <rect x="48" y="24" width="104" height="82" rx="18" fill="url(#successBgGrad)" stroke="#A7F3D0" strokeWidth="1.5" filter="url(#shadowSuccessCard)" />

            {/* Document lines / checklist inside card */}
            <rect x="64" y="38" width="44" height="6" rx="3" fill="#A7F3D0" />
            <rect x="64" y="50" width="32" height="5" rx="2.5" fill="#CBD5E1" opacity="0.6" />
            <rect x="64" y="60" width="38" height="5" rx="2.5" fill="#CBD5E1" opacity="0.6" />
            <rect x="64" y="70" width="24" height="5" rx="2.5" fill="#CBD5E1" opacity="0.6" />

            {/* Checkmark Badge floating on right */}
            <g transform="translate(108, 44)" filter="url(#shadowSuccess)">
                <circle cx="22" cy="22" r="22" fill="url(#successBadgeGrad)" />
                <path d="M 14 22 L 19 27 L 30 16" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Star badge floating top left */}
            <g transform="translate(40, 36)" filter="url(#shadowSuccessCard)">
                <circle cx="14" cy="14" r="14" fill="#FFFFFF" stroke="#D1FAE5" strokeWidth="1.5" />
                <path d="M 14 8 L 15.8 12.2 L 20.4 12.5 L 16.9 15.5 L 18 20 L 14 17.5 L 10 20 L 11.1 15.5 L 7.6 12.5 L 12.2 12.2 Z" fill="url(#shieldGrad)" />
            </g>

            {/* Confetti & Sparkles */}
            <circle cx="162" cy="28" r="2.5" fill="#10B981" opacity="0.8" />
            <circle cx="34" cy="80" r="2" fill="#34D399" opacity="0.7" />
            <circle cx="166" cy="94" r="3" fill="#6EE7B7" opacity="0.8" />
            <path d="M 160 58 L 164 62 M 164 58 L 160 62" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </svg>
    </div>
);

// 11. Salir Sin Guardar / Spot Illustration
const UnsavedWarningSpotIllustration = ({ className = "relative w-48 h-32 mb-2 flex items-center justify-center animate-stagger" }: { className?: string }) => (
    <div className={className}>
        <svg width="200" height="130" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="warningBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="100%" stopColor="#FEF3C7" />
                </linearGradient>
                <linearGradient id="warningBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <filter id="shadowWarning" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#D97706" floodOpacity="0.22" />
                </filter>
                <filter id="shadowWarningCard" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#78350F" floodOpacity="0.06" />
                </filter>
            </defs>

            {/* Background glow & decorative circles */}
            <circle cx="100" cy="65" r="56" fill="#FFFBEB" opacity="0.9" />
            <circle cx="100" cy="65" r="44" fill="#FEF3C7" opacity="0.5" />

            {/* Main Card Backdrop */}
            <rect x="48" y="24" width="104" height="82" rx="18" fill="url(#warningBgGrad)" stroke="#FDE68A" strokeWidth="1.5" filter="url(#shadowWarningCard)" />

            {/* Disk / Document base */}
            <rect x="66" y="38" width="46" height="52" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="74" y="38" width="30" height="18" rx="2" fill="#E2E8F0" />
            <rect x="80" y="42" width="8" height="10" fill="#94A3B8" />
            <rect x="72" y="66" width="34" height="16" rx="3" fill="#F1F5F9" />
            <line x1="76" y1="71" x2="98" y2="71" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <line x1="76" y1="76" x2="90" y2="76" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

            {/* Warning Alert Triangle badge floating right */}
            <g transform="translate(106, 44)" filter="url(#shadowWarning)">
                <circle cx="22" cy="22" r="22" fill="url(#warningBadgeGrad)" />
                <path d="M 22 13 V 23 M 22 28 V 29" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Pencil / Draft icon floating top left */}
            <g transform="translate(38, 36)" filter="url(#shadowWarningCard)">
                <circle cx="14" cy="14" r="14" fill="#FFFFFF" stroke="#FEF3C7" strokeWidth="1.5" />
                <path d="M 18 10 L 19 11 L 12 18 L 10 18 L 10 16 Z" fill="#F59E0B" />
            </g>

            {/* Sparkles / Ambient particles */}
            <circle cx="162" cy="30" r="2.5" fill="#F59E0B" opacity="0.8" />
            <circle cx="34" cy="82" r="2" fill="#FBBF24" opacity="0.7" />
            <circle cx="166" cy="96" r="3" fill="#FDE68A" opacity="0.8" />
        </svg>
    </div>
);

// 12. Role Badge Component (Gold Admin & Classic User)
const RoleBadge = ({ role, size = 'md' }: { role: string; size?: 'sm' | 'md' }) => {
    const roleLower = (role || '').toLowerCase().trim();
    const isAdmin = roleLower === 'admin' || roleLower === 'administrador';

    if (isAdmin) {
        if (size === 'sm') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-amber-950 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 border border-amber-400/90 shadow-[0_2px_8px_-2px_rgba(245,158,11,0.4)] tracking-wide uppercase select-none">
                    <Crown size={11} className="text-amber-900 fill-amber-500 stroke-[2.2]" />
                    <span>Admin</span>
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-amber-950 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 border border-amber-400/90 shadow-[0_3px_12px_-2px_rgba(245,158,11,0.4)] tracking-wide transition-all hover:scale-105 select-none">
                <Crown size={14} className="text-amber-900 fill-amber-500 stroke-[2.2] animate-pulse" />
                <span className="text-amber-950 font-extrabold uppercase tracking-wider text-[11px]">Admin</span>
            </span>
        );
    }

    if (size === 'sm') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/80 select-none">
                <User size={10} className="text-slate-400 stroke-[2]" />
                <span>Usuario</span>
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/80 shadow-xs select-none">
            <User size={13} className="text-slate-400 stroke-[2]" />
            <span>Usuario</span>
        </span>
    );
};

// --- ESTILOS GLOBALES DE ANIMACIÓN ---
const GlobalStyles = () => (
    <style>{`
        @keyframes staggerFadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes staggerFadeInLeft {
            0% { opacity: 0; transform: translateX(-20px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes staggerFadeInDown {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        @keyframes progress {
            0% { transform: scaleX(0); transform-origin: left; }
            50% { transform: scaleX(1); transform-origin: left; }
            50.1% { transform: scaleX(1); transform-origin: right; }
            100% { transform: scaleX(0); transform-origin: right; }
        }
        .animate-stagger {
            opacity: 0;
            animation: staggerFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-stagger-left {
            opacity: 0;
            animation: staggerFadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-stagger-down {
            opacity: 0;
            animation: staggerFadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
    `}</style>
);

// --- MOCK DATA ---
const initialProducts: any[] = [];
const initialClients: any[] = [];
const initialTasks: any[] = [];
const initialDocuments: any[] = [];
const initialAccesses: any[] = [];
const initialCommissions: any[] = [];

const PIE_COLORS = ['#203e71', '#488fcc', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];


// --- STATE MANAGEMENT CONTEXT ---
const AppContext = createContext<any>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [syncLoading, setSyncLoading] = useState(false);

    const [clients, setClients] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [accesses, setAccesses] = useState<any[]>(initialAccesses);
    const [commissions, setCommissions] = useState<any[]>(initialCommissions);

    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [clientActiveTab, setClientActiveTab] = useState('general');
    const [previousView, setPreviousView] = useState<string | null>(null);

    // Settings-related states
    const [profile, setProfile] = useState<{
        name: string;
        email: string;
        photo: string;
        role: string;
        ha_visto_tutorial?: boolean;
    }>({
        name: 'Usuario ERP',
        email: '',
        photo: '',
        role: 'usuario',
        ha_visto_tutorial: true // Default to true to prevent flash before load
    });
    const [business, setBusiness] = useState({
        name: 'Servicios Corporativos',
        logo: ''
    });
    const [systemUsers, setSystemUsers] = useState<any[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    // --- GLOBAL TOAST NOTIFICATION STATE ---
    const [toast, setToast] = useState<{ show: boolean; title: string; message?: string; type?: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ show: true, title, message, type });
    };

    useEffect(() => {
        if (toast?.show) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // --- UNSAVED CHANGES GUARD STATE ---
    const [unsavedGuard, setUnsavedGuard] = useState<{
        hasChanges: boolean;
        saveHandler: () => Promise<boolean | void> | boolean | void;
        resetHandler: () => void;
    } | null>(null);

    const [pendingNav, setPendingNav] = useState<{ view: string; clientId: string | null; tab: string } | null>(null);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [isSavingUnsaved, setIsSavingUnsaved] = useState(false);

    const setUnsavedChangesGuard = (guard: {
        hasChanges: boolean;
        saveHandler: () => Promise<boolean | void> | boolean | void;
        resetHandler: () => void;
    } | null) => {
        setUnsavedGuard(guard);
    };

    // Check user session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setCurrentView('dashboard');
            setSelectedClientId(null);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setUser((prevUser) => {
                    if (!prevUser) {
                        setCurrentView('dashboard');
                        setSelectedClientId(null);
                    }
                    return session?.user ?? null;
                });
            } else {
                setUser(session?.user ?? null);
            }
            setAuthLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Real-time Presence tracking
    useEffect(() => {
        if (!user) {
            setOnlineUsers([]);
            return;
        }

        const presenceChannel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        const syncPresence = () => {
            const state = presenceChannel.presenceState();
            const onlineIds = Object.keys(state);
            setOnlineUsers(onlineIds);
        };

        presenceChannel
            .on('presence', { event: 'sync' }, syncPresence)
            .on('presence', { event: 'join' }, syncPresence)
            .on('presence', { event: 'leave' }, syncPresence)
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            presenceChannel.unsubscribe();
        };
    }, [user]);

    // Load database tables once authenticated
    const loadAllData = async (silent = false) => {
        if (!user) return;
        if (!silent) setSyncLoading(true);
        try {
            // 1. Profile load
            const { data: profileData } = await supabase
                .from('perfiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile({
                    name: profileData.nombre,
                    email: user.email || '',
                    photo: profileData.foto_perfil_url || '',
                    role: profileData.rol || 'usuario',
                    ha_visto_tutorial: profileData.ha_visto_tutorial ?? false
                });
            } else {
                // Insert fallback profile
                const fallbackName = user.email?.split('@')[0] || 'Usuario ERP';
                const { data: createdProfile } = await supabase.from('perfiles').insert({
                    id: user.id,
                    nombre: fallbackName,
                    rol: user.email?.includes('admin') ? 'admin' : 'usuario',
                    ha_visto_tutorial: false
                }).select().single();

                if (createdProfile) {
                    setProfile({
                        name: createdProfile.nombre,
                        email: user.email || '',
                        photo: createdProfile.foto_perfil_url || '',
                        role: createdProfile.rol || 'usuario',
                        ha_visto_tutorial: createdProfile.ha_visto_tutorial ?? false
                    });
                }
            }

            // Check if we need to execute initial database wipe for created items
            const autoCleaned = localStorage.getItem('erp_auto_cleaned_v2');
            if (!autoCleaned) {
                try {
                    await supabase.from('cliente_servicios').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                    await supabase.from('tareas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                    await supabase.from('documentos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                    await supabase.from('clientes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                    await supabase.from('servicios').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                } catch (cleanErr) {
                    console.error('Error during database cleanup:', cleanErr);
                }
                localStorage.setItem('erp_auto_cleaned_v2', 'true');
            }

            // 2. Fetch products / services
            const { data: productsData } = await supabase
                .from('servicios')
                .select('*')
                .order('fecha_creacion', { ascending: true });

            if (productsData) {
                setProducts(productsData.map(p => ({
                    id: p.id,
                    name: p.nombre,
                    description: p.descripcion,
                    price: parseFloat(p.precio_base),
                    commissionRate: parseFloat(p.comision_porcentaje),
                    status: p.estado === 'activo' ? 'Activo' : 'Inactivo'
                })));
            }

            // 3. Fetch clients + services
            const { data: clientsData } = await supabase
                .from('clientes')
                .select('*, cliente_servicios(*)')
                .order('fecha_creacion', { ascending: false });

            if (clientsData) {
                setClients(clientsData.map(c => ({
                    id: c.id,
                    number: c.numero_cliente?.replace('#', '') || '000',
                    name: c.nombre,
                    company: c.empresa || '',
                    email: c.correo,
                    phone: c.telefono || '',
                    status: 'Activo',
                    dateAdded: c.fecha_creacion?.split('T')[0] || '',
                    services: c.cliente_servicios ? c.cliente_servicios.map((cs: any) => ({
                        productId: cs.servicio_id,
                        amount: parseFloat(cs.monto_acordado)
                    })) : []
                })));
            }

            // 4. Fetch tasks
            const { data: tasksData } = await supabase
                .from('tareas')
                .select('*, perfiles(nombre)')
                .order('fecha_limite', { ascending: true });

            if (tasksData) {
                setTasks(tasksData.map(t => {
                    const parts = (t.descripcion || '').split('---SPLIT---');
                    const name = parts[0];
                    const description = parts.length > 1 ? parts[1] : '';
                    return {
                        id: t.id,
                        name: name,
                        description: description,
                    assignee: t.perfiles?.nombre || 'Sin asignar',
                    assigneeId: t.responsable_id || '',
                    priority: t.prioridad ? (t.prioridad.charAt(0).toUpperCase() + t.prioridad.slice(1)) : 'Media',
                    clientId: t.cliente_id,
                    status: t.estado === 'finalizada' ? 'Finalizada' : 'Pendiente',
                    date: t.fecha_limite
                };
            }));
            }

            // 5. Fetch documents
            const { data: docsData } = await supabase
                .from('documentos')
                .select('*')
                .order('fecha_subida', { ascending: false });

            if (docsData) {
                setDocuments(docsData.map(d => ({
                    id: d.id,
                    clientId: d.cliente_id,
                    name: d.nombre_archivo + (d.extension ? `.${d.extension}` : ''),
                    customName: d.nombre_archivo,
                    ext: d.extension,
                    type: d.extension ? d.extension.toUpperCase() : 'PDF',
                    size: 'N/A',
                    url: d.url_archivo,
                    date: d.fecha_subida ? d.fecha_subida.split('T')[0] : ''
                })));
            }

            // 6. Fetch profiles for systemUsers
            // Sync current user email to perfiles
            if (user?.email) {
                await supabase.from('perfiles').update({ email: user.email }).eq('id', user.id);
            }

            const { data: perfilesData } = await supabase
                .from('perfiles')
                .select('*')
                .order('fecha_creacion', { ascending: true });

            if (perfilesData) {
                const sortedPerfiles = [...perfilesData].sort((a, b) => {
                    if (a.id === user?.id) return -1;
                    if (b.id === user?.id) return 1;
                    return 0;
                });

                setSystemUsers(sortedPerfiles.map(p => ({
                    id: p.id,
                    name: p.nombre,
                    email: p.id === user?.id ? user.email : (p.email || `${p.nombre.toLowerCase().replace(/\s+/g, '')}@corp.com`),
                    role: p.rol === 'admin' ? 'Admin' : 'Usuario',
                    status: 'Activo',
                    photo: p.foto_perfil_url || ''
                })));
            }
        } catch (err) {
            console.error('Error fetching from Supabase:', err);
        } finally {
            if (!silent) setSyncLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadAllData();
            
            const channel = supabase.channel('schema-db-changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'perfiles' }, () => loadAllData(true))
                .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, () => loadAllData(true))
                .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, () => loadAllData(true))
                .on('postgres_changes', { event: '*', schema: 'public', table: 'servicios' }, () => loadAllData(true))
                .on('postgres_changes', { event: '*', schema: 'public', table: 'cliente_servicios' }, () => loadAllData(true))
                .on('postgres_changes', { event: '*', schema: 'public', table: 'documentos' }, () => loadAllData(true))
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } else {
            // Reset to empty
            setClients([]);
            setProducts([]);
            setTasks([]);
            setDocuments([]);
            setProfile({
                name: 'Usuario ERP',
                email: '',
                photo: '',
                role: 'usuario'
            });
            setSystemUsers([]);
        }
    }, [user]);

    // Custom State Setters that sync immediately with Supabase
    const customSetClients = async (value: any) => {
        let newClients = typeof value === 'function' ? value(clients) : value;
        setClients(newClients);

        try {
            if (newClients.length > clients.length) {
                // Added client
                const added = newClients.filter((c: any) => !clients.some((existing: any) => existing.id === c.id));
                for (const item of added) {
                    const { data: createdClient, error } = await supabase.from('clientes').insert({
                        nombre: item.name,
                        empresa: item.company || null,
                        correo: item.email,
                        telefono: item.phone || null
                    }).select().single();

                    if (createdClient) {
                        // Insert assigned services
                        if (item.services && item.services.length > 0) {
                            const servicesToInsert = item.services.map((s: any) => ({
                                cliente_id: createdClient.id,
                                servicio_id: s.productId,
                                monto_acordado: s.amount || 0,
                                estado: 'activo'
                            }));
                            await supabase.from('cliente_servicios').insert(servicesToInsert);
                        }

                        newClients = newClients.map((c: any) => c.id === item.id ? {
                            ...c,
                            id: createdClient.id,
                            number: createdClient.numero_cliente?.replace('#', '') || c.number,
                            dateAdded: createdClient.fecha_creacion?.split('T')[0] || c.dateAdded
                        } : c);
                    }
                }
                        } else if (newClients.length < clients.length) {
                // Deleted client
                console.log('DELETING CLIENTS. old:', clients.length, 'new:', newClients.length);
                const deleted = clients.filter((c: any) => !newClients.some((item: any) => item.id === c.id));
                console.log('Deleted items:', deleted);
                for (const item of deleted) {
                    try {
                        // Delete relations first in case there is no ON DELETE CASCADE
                        await supabase.from('cliente_servicios').delete().eq('cliente_id', item.id);
                        await supabase.from('tareas').delete().eq('cliente_id', item.id);
                        await supabase.from('documentos').delete().eq('cliente_id', item.id);
                        
                        const { error } = await supabase.from('clientes').delete().eq('id', item.id);
                        if (error) {
                            console.error('Error deleting client from Supabase:', error);
                            alert('No se pudo eliminar el cliente en la base de datos: ' + error.message);
                        }
                    } catch (e) {
                        console.error('Exception deleting client:', e);
                    }
                }
            } else {
                // Updated client
                for (const item of newClients) {
                    const existing = clients.find((c: any) => c.id === item.id);
                    if (existing && (existing.name !== item.name || existing.company !== item.company || existing.email !== item.email || existing.phone !== item.phone || JSON.stringify(existing.services) !== JSON.stringify(item.services))) {
                        await supabase.from('clientes').update({
                            nombre: item.name,
                            empresa: item.company || null,
                            correo: item.email,
                            telefono: item.phone || null
                        }).eq('id', item.id);

                        // Sync services: delete existing and re-insert
                        await supabase.from('cliente_servicios').delete().eq('cliente_id', item.id);
                        if (item.services && item.services.length > 0) {
                            const servicesToInsert = item.services.map((s: any) => ({
                                cliente_id: item.id,
                                servicio_id: s.productId,
                                monto_acordado: s.amount || 0,
                                estado: 'activo'
                            }));
                            await supabase.from('cliente_servicios').insert(servicesToInsert);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error syncing clients with Supabase:', err);
        }

        setClients(newClients);
    };

    const customSetProducts = async (value: any) => {
        let newProducts = typeof value === 'function' ? value(products) : value;
        setProducts(newProducts);

        try {
            if (newProducts.length > products.length) {
                // Added service
                const added = newProducts.filter((p: any) => !products.some((existing: any) => existing.id === p.id));
                for (const item of added) {
                    await supabase.from('servicios').insert({
                        id: item.id,
                        nombre: item.name,
                        descripcion: item.description,
                        precio_base: item.price || 0,
                        comision_porcentaje: item.commissionRate || 0,
                        estado: item.status === 'Activo' ? 'activo' : 'inactivo'
                    });
                }
            } else if (newProducts.length < products.length) {
                // Deleted service
                const deleted = products.filter((p: any) => !newProducts.some((item: any) => item.id === p.id));
                for (const item of deleted) {
                    // Check if assigned
                    const { data: assignments } = await supabase
                        .from('cliente_servicios')
                        .select('id')
                        .eq('servicio_id', item.id)
                        .limit(1);

                    if (assignments && assignments.length > 0) {
                        alert(`No se puede eliminar el servicio "${item.name}" porque está asignado a clientes activos.`);
                        return;
                    }

                    await supabase.from('servicios').delete().eq('id', item.id);
                }
            } else {
                // Updated service
                for (const item of newProducts) {
                    const existing = products.find((p: any) => p.id === item.id);
                    if (existing && (existing.name !== item.name || existing.description !== item.description || existing.price !== item.price || existing.commissionRate !== item.commissionRate || existing.status !== item.status)) {
                        await supabase.from('servicios').update({
                            nombre: item.name,
                            descripcion: item.description,
                            precio_base: item.price || 0,
                            comision_porcentaje: item.commissionRate || 0,
                            estado: item.status === 'Activo' ? 'activo' : 'inactivo'
                        }).eq('id', item.id);
                    }
                }
            }
        } catch (err) {
            console.error('Error syncing services with Supabase:', err);
        }

        setProducts(newProducts);
    };

    const customSetTasks = async (value: any) => {
        let newTasks = typeof value === 'function' ? value(tasks) : value;
        setTasks(newTasks);

        try {
            if (newTasks.length > tasks.length) {
                // Added task
                const added = newTasks.filter((t: any) => !tasks.some((existing: any) => existing.id === t.id));
                for (const item of added) {
                    // Find matching profile ID
                    const { data: matches } = await supabase
                        .from('perfiles')
                        .select('id')
                        .eq('nombre', item.assignee)
                        .limit(1);

                    const assigneeId = matches?.[0]?.id || user.id;

                    const { data: createdTask } = await supabase.from('tareas').insert({
                        cliente_id: item.clientId || null,
                        descripcion: item.description ? `${item.name}---SPLIT---${item.description}` : item.name,
                        responsable_id: assigneeId,
                        fecha_limite: item.date || new Date().toISOString().split('T')[0],
                        prioridad: (item.priority || 'media').toLowerCase(),
                        estado: item.status === 'Finalizada' ? 'finalizada' : 'pendiente'
                    }).select().single();

                    if (createdTask) {
                        newTasks = newTasks.map((t: any) => t.id === item.id ? { 
                            ...t, 
                            id: createdTask.id, 
                            assigneeId 
                        } : t);
                    }
                }
            } else if (newTasks.length < tasks.length) {
                // Deleted task
                const deleted = tasks.filter((t: any) => !newTasks.some((item: any) => item.id === t.id));
                for (const item of deleted) {
                    await supabase.from('tareas').delete().eq('id', item.id);
                }
            } else {
                // Updated task
                for (const item of newTasks) {
                    const existing = tasks.find((t: any) => t.id === item.id);
                    if (existing && (existing.name !== item.name || existing.description !== item.description || existing.status !== item.status || existing.priority !== item.priority || existing.date !== item.date || existing.assignee !== item.assignee)) {
                        const { data: matches } = await supabase
                            .from('perfiles')
                            .select('id')
                            .eq('nombre', item.assignee)
                            .limit(1);

                        const assigneeId = matches?.[0]?.id || item.assigneeId || user.id;

                        await supabase.from('tareas').update({
                            descripcion: item.description ? `${item.name}---SPLIT---${item.description}` : item.name,
                            responsable_id: assigneeId,
                            fecha_limite: item.date,
                            prioridad: (item.priority || 'media').toLowerCase(),
                            estado: item.status === 'Finalizada' ? 'finalizada' : 'pendiente'
                        }).eq('id', item.id);
                    }
                }
            }
        } catch (err) {
            console.error('Error syncing tasks with Supabase:', err);
        }

        setTasks(newTasks);
    };

    const customSetDocuments = async (value: any) => {
        let newDocs = typeof value === 'function' ? value(documents) : value;
        setDocuments(newDocs);

        try {
            if (newDocs.length > documents.length) {
                // Added document(s)
                const added = newDocs.filter((d: any) => !documents.some((existing: any) => existing.id === d.id));
                for (const item of added) {
                    let fileUrl = item.url || '';
                    const fileExt = item.ext || item.name.split('.').pop() || 'pdf';

                    if (item.file) {
                        const filePath = `${item.clientId}/${Date.now()}_${item.customName}.${fileExt}`;
                        const { error: uploadError } = await supabase.storage
                            .from('documents')
                            .upload(filePath, item.file);

                        if (!uploadError) {
                            fileUrl = filePath; // Guardamos el filePath en lugar de publicUrl porque el bucket es privado
                        } else {
                            console.warn('Storage bucket upload failed, using fallback object URL:', uploadError);
                        }
                    }

                    const { data: createdDoc } = await supabase.from('documentos').insert({
                        cliente_id: item.clientId,
                        nombre_archivo: item.customName || item.name.split('.')[0],
                        extension: fileExt,
                        url_archivo: fileUrl
                    }).select().single();

                    if (createdDoc) {
                        newDocs = newDocs.map((d: any) => d.id === item.id ? {
                            ...d,
                            id: createdDoc.id,
                            url: fileUrl
                        } : d);
                    }
                }
            } else if (newDocs.length < documents.length) {
                // Deleted document
                const deleted = documents.filter((d: any) => !newDocs.some((item: any) => item.id === d.id));
                for (const item of deleted) {
                    await supabase.from('documentos').delete().eq('id', item.id);
                }
            }
        } catch (err) {
            console.error('Error syncing documents with Supabase:', err);
        }

        setDocuments(newDocs);
    };

    const customSetProfile = async (value: any) => {
        const newProfile = typeof value === 'function' ? value(profile) : value;
        setProfile(newProfile);
        try {
            if (user) {
                await supabase.from('perfiles').update({
                    nombre: newProfile.name,
                    foto_perfil_url: newProfile.photo,
                    ha_visto_tutorial: newProfile.ha_visto_tutorial
                }).eq('id', user.id);
            }
        } catch (err) {
            console.error('Error updating profile in Supabase:', err);
        }
    };

    const customSetSystemUsers = async (value: any) => {
        let newUsers = typeof value === 'function' ? value(systemUsers) : value;
        setSystemUsers(newUsers);

        try {
            if (newUsers.length > systemUsers.length) {
                // Added member (requires insertion to perfiles)
                const added = newUsers.filter((u: any) => !systemUsers.some((existing: any) => existing.id === u.id));
                for (const item of added) {
                    const { data: createdProfile } = await supabase.from('perfiles').insert({
                        nombre: item.name,
                        rol: item.role === 'Admin' ? 'admin' : 'usuario',
                        foto_perfil_url: item.photo || ''
                    }).select().single();

                    if (createdProfile) {
                        newUsers = newUsers.map((u: any) => u.id === item.id ? { ...u, id: createdProfile.id } : u);
                    }
                }
            } else if (newUsers.length < systemUsers.length) {
                // Deleted member
                const deleted = systemUsers.filter((u: any) => !newUsers.some((item: any) => item.id === u.id));
                for (const item of deleted) {
                    await supabase.from('perfiles').delete().eq('id', item.id);
                }
            } else {
                // Updated role
                for (const item of newUsers) {
                    const existing = systemUsers.find((u: any) => u.id === item.id);
                    if (existing && (existing.role !== item.role || existing.name !== item.name || existing.photo !== item.photo)) {
                        await supabase.from('perfiles').update({
                            nombre: item.name,
                            rol: item.role === 'Admin' ? 'admin' : 'usuario',
                            foto_perfil_url: item.photo || ''
                        }).eq('id', item.id);
                    }
                }
            }
        } catch (err) {
            console.error('Error syncing system users with Supabase:', err);
        }

        setSystemUsers(newUsers);
    };

    // Helpers to get related data
    const getClientData = (clientId: string) => ({
        client: clients.find(c => c.id === clientId),
        clientTasks: tasks.filter(t => t.clientId === clientId).sort((a: any, b: any) => {
            const dateA = new Date(a.date).getTime() || 0;
            const dateB = new Date(b.date).getTime() || 0;
            if (dateA !== dateB) return dateA - dateB;
            const priorityOrder: any = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
            return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
        }),
        clientDocs: documents.filter(d => d.clientId === clientId),
        clientAccesses: accesses.filter(a => a.clientId === clientId),
        clientCommissions: commissions.filter(c => c.clientId === clientId)
    });

    const navigateTo = (view: string, clientId: string | null = null, tab: string = 'general') => {
        if (unsavedGuard && unsavedGuard.hasChanges && (view !== currentView || clientId !== selectedClientId)) {
            setPendingNav({ view, clientId, tab });
            setShowUnsavedModal(true);
            return;
        }
        setPreviousView(currentView);
        setCurrentView(view);
        setSelectedClientId(clientId);
        setClientActiveTab(tab);
    };

    const handleSaveAndNavigate = async () => {
        if (!unsavedGuard || !pendingNav) return;
        setIsSavingUnsaved(true);
        try {
            if (unsavedGuard.saveHandler) {
                await unsavedGuard.saveHandler();
            }
            setUnsavedGuard(null);
            setShowUnsavedModal(false);
            setPreviousView(currentView);
            setCurrentView(pendingNav.view);
            setSelectedClientId(pendingNav.clientId);
            setClientActiveTab(pendingNav.tab);
            setPendingNav(null);
        } catch (err) {
            console.error('Error al guardar cambios antes de navegar:', err);
        } finally {
            setIsSavingUnsaved(false);
        }
    };

    const handleDiscardAndNavigate = () => {
        if (unsavedGuard?.resetHandler) {
            unsavedGuard.resetHandler();
        }
        setUnsavedGuard(null);
        setShowUnsavedModal(false);
        if (pendingNav) {
            setPreviousView(currentView);
            setCurrentView(pendingNav.view);
            setSelectedClientId(pendingNav.clientId);
            setClientActiveTab(pendingNav.tab);
            setPendingNav(null);
        }
    };

    const handleCancelNavigation = () => {
        setShowUnsavedModal(false);
        setPendingNav(null);
    };

    return (
        <AppContext.Provider value={{
            user,
            loading: authLoading || syncLoading,
            clients, setClients: customSetClients,
            products, setProducts: customSetProducts,
            tasks, setTasks: customSetTasks,
            documents, setDocuments: customSetDocuments,
            accesses, setAccesses,
            commissions, setCommissions,
            currentView, navigateTo,
            selectedClientId, getClientData,
            clientActiveTab, setClientActiveTab,
            previousView,
            profile, setProfile: customSetProfile,
            business, setBusiness,
            systemUsers, setSystemUsers: customSetSystemUsers,
            onlineUsers,
            showToast,
            toast,
            setToast,
            setUnsavedChangesGuard,
            unsavedGuard,
            showUnsavedModal,
            handleSaveAndNavigate,
            handleDiscardAndNavigate,
            handleCancelNavigation,
            isSavingUnsaved
        }}>
            {children}
        </AppContext.Provider>
    );
};


// --- SHARED UI COMPONENTS ---
const ClientFormModal = ({ isOpen, onClose, onSubmit, initialData }: any) => {
    const { products } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        idNumber: '',
        email: '',
        phone: '',
        services: [] as any[],
        status: 'Activo'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                services: initialData.services || (initialData.productId ? [{ productId: initialData.productId, amount: initialData.amount }] : [])
            });
        } else {
            setFormData({ name: '', company: '', idNumber: '', email: '', phone: '', services: [], status: 'Activo' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const addService = () => {
        setFormData({ ...formData, services: [...formData.services, { productId: '', amount: '' }] });
    };

    const updateService = (index: number, field: string, value: any) => {
        const newServices = [...formData.services];
        if (field === 'productId') {
            const prod = products.find((p: any) => p.id === value);
            newServices[index] = {
                ...newServices[index],
                productId: value,
                amount: prod ? prod.price : ''
            };
        } else {
            newServices[index] = { ...newServices[index], [field]: value };
        }
        setFormData({ ...formData, services: newServices });
    };

    const removeService = (index: number) => {
        const newServices = formData.services.filter((_, i) => i !== index);
        setFormData({ ...formData, services: newServices });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/15 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">{initialData ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-4">Información Principal</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa <span className="text-gray-400 font-normal text-xs">(Opcional)</span></label>
                                <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent text-sm" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h4 className="text-sm font-semibold text-gray-900">Detalles del Servicio</h4>
                            <button type="button" onClick={addService} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                                <Plus size={14} /> Añadir Servicio
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {formData.services.map((service: any, index: number) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100 relative animate-in fade-in duration-150">
                                    <div className="md:col-span-6">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Producto Contratado</label>
                                        <select required value={service.productId} onChange={e => updateService(index, 'productId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent bg-white text-sm">
                                            <option value="">Seleccione un producto</option>
                                            {products.map((p: any) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-5">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Monto del Servicio ($)</label>
                                        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm select-none h-10 flex items-center">
                                            {service.amount !== undefined && service.amount !== '' ? `$${service.amount}` : '—'}
                                        </div>
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <button type="button" onClick={() => removeService(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {formData.services.length === 0 && (
                                <div className="py-2">
                                    <EmptySearchIllustration title="Sin servicios" description="No hay servicios asignados aún." />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="primary">Guardar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UploadFormModal = ({ isOpen, onClose, onSubmit, initialFiles = [] }: any) => {
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {
        if (initialFiles) {
            setFiles(initialFiles);
        }
    }, [initialFiles, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(files);
    };

    const handleNameChange = (index: number, newName: string) => {
        const newFiles = [...files];
        newFiles[index].customName = newName;
        setFiles(newFiles);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/15 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 animate-stagger" style={{animationDuration: '0.4s'}}>
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-semibold text-gray-900">Subir Archivos</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {files.map((file, i) => (
                            <div key={i} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl">
                                <div className="flex-1 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nombre del archivo <span className="text-gray-400 font-normal">(.{file.ext})</span>
                                    </label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={file.customName} 
                                        onChange={e => handleNameChange(i, e.target.value)} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent bg-white"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Tamaño: {file.size}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="primary">Guardar Archivos</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TaskFormModal = ({ isOpen, onClose, onSubmit, clientId = '', initialData = null }: any) => {
    const { clients, systemUsers } = useContext(AppContext);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        assignee: '',
        priority: 'Media',
        clientId: clientId,
        status: 'Pendiente',
        date: new Date().toISOString().split('T')[0]
    });

    



    const availableMembers = useMemo(() => {
        if (systemUsers) {
            return systemUsers.map((u: any, index: number) => {
                const colors = [
                    'bg-blue-500 text-white',
                    'bg-emerald-500 text-white',
                    'bg-amber-500 text-white',
                    'bg-rose-500 text-white',
                    'bg-purple-500 text-white',
                    'bg-teal-500 text-white'
                ];
                return {
                    id: u.id || `u-${index}`,
                    name: u.name || u.nombre || 'Integrante',
                    role: u.role || 'Usuario',
                    photo: u.photo || u.foto_perfil_url || '',
                    color: colors[index % colors.length]
                };
            });
        }
        return [];
    }, [systemUsers]);

    // Calendar month state
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (initialData) {
            const data = {
                name: initialData.name || '',
                description: initialData.description || '',
                assignee: initialData.assignee || '',
                priority: initialData.priority || 'Media',
                clientId: initialData.clientId || clientId,
                status: initialData.status || 'Pendiente',
                date: initialData.date || new Date().toISOString().split('T')[0]
            };
            setFormData(data);

            // Set custom assignee status
            

            // Sync calendar view month
            const parsed = new Date(data.date + 'T00:00:00');
            if (!isNaN(parsed.getTime())) {
                setCurrentMonth(parsed);
            }
        } else {
            const defaultDate = new Date().toISOString().split('T')[0];
            setFormData({ 
                name: '', 
                description: '', 
                assignee: availableMembers[0]?.name || '', 
                priority: 'Media', 
                clientId: clientId, 
                status: 'Pendiente',
                date: defaultDate
            });
            
            setCurrentMonth(new Date());
        }
    }, [isOpen, clientId, initialData, availableMembers]);

    if (!isOpen) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const finalAssignee = formData.assignee;
        onSubmit({
            ...formData,
            assignee: finalAssignee || 'Sin asignar'
        });
    };

    // Calculate calendar days
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const handlePrevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    // Fill days array
    const cells = [];
    // Previous month trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        cells.push({
            day: prevMonthTotalDays - i,
            isCurrentMonth: false,
            dateString: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, '0')}-${String(prevMonthTotalDays - i).padStart(2, '0')}`
        });
    }
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
        cells.push({
            day: i,
            isCurrentMonth: true,
            dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        });
    }
    // Next month trailing days to complete grid
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
        cells.push({
            day: i,
            isCurrentMonth: false,
            dateString: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        });
    }

    const selectedDateStr = formData.date;
    const todayStr = new Date().toISOString().split('T')[0];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/15 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <CheckSquare className="text-[#203e71]" size={18} />
                        <span>{initialData ? 'Editar Tarea' : 'Nueva Tarea'}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 hover:bg-gray-100 rounded-lg">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-1">
                        
                        {/* Columna Izquierda: Detalles */}
                        <div className="space-y-4">
                            {!clientId && !initialData?.clientId && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Cliente</label>
                                    <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent bg-white text-xs font-semibold">
                                        <option value="">Seleccione un cliente</option>
                                        {clients.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Título de la Tarea</label>
                                <input required type="text" placeholder="Ej. Recopilar firmas de contrato" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent text-xs font-medium placeholder-gray-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Descripción</label>
                                <textarea placeholder="Describe el objetivo de esta tarea..." rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent text-xs font-medium placeholder-gray-400"></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Prioridad</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Baja', 'Media', 'Alta'].map((p) => {
                                        const pColors: any = {
                                            'Baja': 'border-blue-100 text-blue-700 bg-blue-50/30 hover:bg-blue-50',
                                            'Media': 'border-amber-100 text-amber-700 bg-amber-50/30 hover:bg-amber-50',
                                            'Alta': 'border-red-100 text-red-700 bg-red-50/30 hover:bg-red-50'
                                        };
                                        const pSelectedColors: any = {
                                            'Baja': 'border-blue-500 text-blue-700 bg-blue-50 ring-1 ring-blue-500',
                                            'Media': 'border-amber-500 text-amber-700 bg-amber-50 ring-1 ring-amber-500',
                                            'Alta': 'border-red-500 text-red-700 bg-red-50 ring-1 ring-red-500'
                                        };
                                        const isSelected = formData.priority === p;
                                        return (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, priority: p })}
                                                className={`
                                                    py-2 px-3 border rounded-xl text-center font-bold text-[11px] transition-all duration-200
                                                    ${isSelected ? pSelectedColors[p] : pColors[p]}
                                                `}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Asignación y Calendario */}
                        <div className="space-y-4">
                            {/* Integrante Asignado */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Asignar a</label>
                                
                                <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                                    {availableMembers.map((member) => {
                                        const isSelected = formData.assignee === member.name;
                                        return (
                                            <button
                                                key={member.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, assignee: member.name });
                                                }}
                                                className={`
                                                    flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all duration-200
                                                    ${isSelected 
                                                        ? 'border-[#203e71] bg-blue-50/50 shadow-sm ring-1 ring-[#203e71]' 
                                                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-350'}
                                                `}
                                            >
                                                <div className="relative flex-shrink-0">
                                                    {member.photo ? (
                                                        <img 
                                                            src={member.photo} 
                                                            alt={member.name} 
                                                            className="w-7 h-7 rounded-full object-cover border border-gray-100"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    ) : (
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${member.color}`}>
                                                            {getInitials(member.name)}
                                                        </div>
                                                    )}
                                                    {isSelected && (
                                                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#203e71] rounded-full border border-white flex items-center justify-center">
                                                            <CheckCircle size={9} className="text-white" />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-bold text-gray-800 truncate leading-tight">{member.name}</p>
                                                    <p className="text-[9px] text-gray-400 font-medium truncate leading-none">{member.role}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                            </div>
                            {/* Calendar Picker (Custom simple implementation) */}
                            <div className="pt-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Fecha Límite</label>
                                <div className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <button type="button" onClick={() => {
                                            const prev = new Date(currentMonth);
                                            prev.setMonth(prev.getMonth() - 1);
                                            setCurrentMonth(prev);
                                        }} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><ChevronLeft size={14} /></button>
                                        <span className="text-[11px] font-bold text-gray-800 capitalize">
                                            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button type="button" onClick={() => {
                                            const next = new Date(currentMonth);
                                            next.setMonth(next.getMonth() + 1);
                                            setCurrentMonth(next);
                                        }} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><ChevronRight size={14} /></button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 mb-1">
                                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                                            <div key={d} className="text-center text-[9px] font-bold text-gray-400">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {(() => {
                                            const year = currentMonth.getFullYear();
                                            const month = currentMonth.getMonth();
                                            const firstDay = new Date(year, month, 1).getDay();
                                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                                            const days = [];
                                            const startPadding = firstDay === 0 ? 6 : firstDay - 1;
                                            for (let i = 0; i < startPadding; i++) {
                                                days.push({ day: '', isCurrentMonth: false });
                                            }
                                            for (let i = 1; i <= daysInMonth; i++) {
                                                days.push({ day: i, isCurrentMonth: true });
                                            }
                                            return days.map((cell, idx) => {
                                                if (!cell.day) return <div key={idx} className="h-6.5 w-6.5"></div>;
                                                const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
                                                const isSelected = formData.date === cellDateStr;
                                                const isToday = new Date().toISOString().split('T')[0] === cellDateStr;
                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, date: cellDateStr })}
                                                        className={`
                                                            h-6.5 w-6.5 text-[10px] font-bold rounded-full flex items-center justify-center transition-all duration-150 relative
                                                            ${!cell.isCurrentMonth ? 'text-gray-300 hover:bg-gray-100' : 'text-gray-700 hover:bg-gray-200'}
                                                            ${isSelected ? '!bg-[#203e71] !text-white shadow-sm scale-110 z-10' : ''}
                                                            ${isToday && !isSelected ? 'border border-[#203e71] text-[#203e71]' : ''}
                                                        `}
                                                    >
                                                        {cell.day}
                                                        {isToday && isSelected && (
                                                            <span className="absolute bottom-0.5 w-0.5 h-0.5 bg-white rounded-full"></span>
                                                        )}
                                                        {isToday && !isSelected && (
                                                            <span className="absolute bottom-0.5 w-0.5 h-0.5 bg-[#203e71] rounded-full"></span>
                                                        )}
                                                    </button>
                                                );
                                            });
                                        })()}
                                        </div>
                                    </div>

                                    {/* Selected date display summary */}
                                    <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-500">
                                        <span className="font-medium flex items-center gap-1">
                                            <Clock size={11} className="text-gray-400" />
                                            Límite:
                                        </span>
                                        <span className="font-bold text-[#203e71] bg-blue-50 px-2 py-0.5 rounded-md">
                                            {(() => {
                                                if (!formData.date) return 'Ninguna';
                                                const [y, m, d] = formData.date.split('-');
                                                const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                                                const daysStr = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
                                                return `${daysStr[dateObj.getDay()]}, ${parseInt(d)} de ${monthNames[parseInt(m) - 1].slice(0, 3)}.`;
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="primary">Guardar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Card = ({ children, className = '', style = {}, noPadding = false, ...props }: any) => {
    const hasBg = className.includes('bg-');
    const hasBorder = className.includes('border-');
    return (
        <div className={`${hasBg ? '' : 'bg-white'} rounded-2xl shadow-sm ${hasBorder ? '' : 'border border-gray-100'} overflow-hidden transition-all duration-300 hover:shadow-md ${noPadding ? '' : 'p-6'} ${className}`} style={style} {...props}>
            {children}
        </div>
    );
};

const SectionTitle = ({ title, subtitle, action, className = '', style = {} }: any) => (
    <div className={`flex justify-between items-end mb-6 ${className}`} style={style}>
        <div>
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

const Badge = ({ children, type = 'default' }: any) => {
    const types: any = {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        default: 'bg-gray-100 text-gray-700'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${types[type] || types.default}`}>
            {children}
        </span>
    );
};

const Button = ({ children, variant = 'primary', icon, onClick, className = '' }: any) => {
    const variants: any = {
        primary: 'bg-[#203e71] hover:bg-[#1a345e] text-white shadow-sm shadow-blue-950/15', // Brand Navy
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        outline: 'border border-gray-200 hover:bg-gray-50 text-gray-700',
        ghost: 'hover:bg-gray-100 text-gray-600'
    };
    
    return (
        <button 
            onClick={onClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors text-sm ${variants[variant]} ${className}`}
        >
            {icon && icon}
            {children}
        </button>
    );
};


// --- VIEWS ---
const DashboardView = () => {
    const { clients, products, tasks, navigateTo, systemUsers, onlineUsers } = useContext(AppContext);

    // Calculate dynamic total active clients
    const activeClientsCount = useMemo(() => {
        return clients.filter((c: any) => c.status === 'Activo').length;
    }, [clients]);

    // Calculate dynamic total sales (sum of all contracted client service amounts)
    const totalSales = useMemo(() => {
        return clients.reduce((acc: number, c: any) => {
            const servicesSum = (c.services || []).reduce((sAcc: number, s: any) => sAcc + Number(s.amount || 0), 0);
            return acc + servicesSum;
        }, 0);
    }, [clients]);

    // Calculate dynamic task completion stats
    const taskStats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter((t: any) => t.status === 'Finalizada').length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, percentage };
    }, [tasks]);
    // Calculate dynamic client chart data
    const chartData = useMemo(() => {
        return clients.map((c: any) => {
            const clientTotal = (c.services || []).reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);
            return {
                name: c.name,
                total: clientTotal
            };
        }).filter((c: any) => c.total > 0)
          .sort((a: any, b: any) => b.total - a.total);
    }, [clients]);


    // Calculate dynamic pie chart data
    const pieChartData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        
        clients.forEach((c: any) => {
            (c.services || []).forEach((s: any) => {
                const prod = products.find((p: any) => p.id === s.productId);
                const prodName = prod ? prod.name : 'Otros';
                counts[prodName] = (counts[prodName] || 0) + Number(s.amount || 0);
            });
        });

        const data = Object.keys(counts).map(name => ({
            name,
            value: counts[name]
        })).filter(item => item.value > 0);

        return data;
    }, [clients, products]);

    return (
        <div className="space-y-6">
            <SectionTitle 
                title="Dashboard" 
                subtitle={new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} 
                className="animate-stagger" style={{ animationDelay: '0ms' }}
            />

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card id="tour-stat-sales" className="bg-[#203e71] border-none text-white animate-stagger" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/10 rounded-lg text-[#488fcc]"><DollarSign size={20} /></div>
                        <span className="text-sm bg-white/10 px-2 py-1 rounded-full text-white/90">Ingreso activo mensual</span>
                    </div>
                    <p className="text-white/70 text-sm">Total ventas</p>
                    <h3 className="text-3xl font-bold mt-1 text-white">${totalSales.toLocaleString()}</h3>
                </Card>

                <Card id="tour-stat-clients" className="bg-[#488fcc] border-none text-white animate-stagger" style={{ animationDelay: '200ms' }}>
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/15 rounded-lg text-[#203e71]"><Users size={20} /></div>
                        <span className="text-sm bg-white/15 px-2 py-1 rounded-full text-white/90">En cartera</span>
                    </div>
                    <p className="text-white/85 text-sm">Clientes activos</p>
                    <h3 className="text-3xl font-bold mt-1 text-white">{activeClientsCount}</h3>
                </Card>

                <Card id="tour-stat-tasks" className="bg-gradient-to-br from-[#203e71] to-[#488fcc] border-none text-white animate-stagger" style={{ animationDelay: '300ms' }}>
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/10 rounded-lg text-[#488fcc]"><CheckSquare size={20} /></div>
                        <span className="text-sm bg-white/10 px-2 py-1 rounded-full text-white/90">{taskStats.completed} de {taskStats.total} tareas</span>
                    </div>
                    <p className="text-white/80 text-sm">Tareas completadas</p>
                    <h3 className="text-3xl font-bold mt-1 text-white">{taskStats.percentage}%</h3>
                </Card>

                <Card id="tour-stat-products" className="bg-[#0f766e] border-none text-white flex flex-col justify-between animate-stagger" style={{ animationDelay: '400ms' }}>
                    <div>
                        <p className="text-white/80 text-sm mb-1">Portafolio</p>
                        <h3 className="text-2xl font-bold">Servicios Ofrecidos</h3>
                        <p className="text-xs text-white/60 mt-1">{products.length} Soluciones en catálogo</p>
                    </div>
                    <Button variant="primary" onClick={() => navigateTo('products')} className="mt-4 w-full bg-[#203e71] text-white hover:bg-[#1a345e] border-none">
                        Gestionar Servicios
                    </Button>
                </Card>
            </div>

            {/* Charts & Lists Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card id="tour-chart-flow" className="lg:col-span-2 animate-stagger" style={{ animationDelay: '500ms' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg text-gray-800">Flujo Financiero</h3>
                    </div>
                    {totalSales === 0 ? (
                        <EmptyChartIllustration />
                    ) : (
                        <div className="h-64 animate-stagger" style={{ animationDelay: '600ms' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                    
<RechartsTooltip 
    animationDuration={300}
    isAnimationActive={true}
    content={({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),_0_4px_6px_-2px_rgba(0,0,0,0.05)] border-none">
                    <p className="text-[13px] font-semibold text-gray-800 mb-1">{payload[0].payload.name}</p>
                    <p className="text-[13px] font-semibold text-[#8B5CF6]">
                        $ {payload[0].value?.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    }}
    cursor={{
        fill: '#f3f4f6'
    }}
/>
<Bar dataKey="total" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={12} />

                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Card>

                <Card id="tour-chart-pie" className="animate-stagger flex flex-col" style={{ animationDelay: '600ms' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-gray-800">Distribución de Servicios</h3>
                    </div>
                    {pieChartData.length === 0 ? (
                        <EmptyPieIllustration />
                    ) : (
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="h-44 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                            isAnimationActive={true}
                                            animationBegin={200}
                                            animationDuration={500}
                                            animationEasing="ease-out"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            content={({ active, payload }: any) => {
                                                if (active && payload && payload.length) {
                                                    const totalPieValue = pieChartData.reduce((acc: number, curr: any) => acc + curr.value, 0);
                                                    const value = payload[0].value;
                                                    const percentage = totalPieValue > 0 ? ((value / totalPieValue) * 100).toFixed(1) : '0.0';
                                                    return (
                                                        <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-md text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                                                            <span>{percentage}%</span>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            {/* Custom HTML Legend: Wraps perfectly and elongates the card dynamically */}
                            <div className="mt-4 border-t border-gray-50 pt-4">
                                <div className="grid grid-cols-1 gap-y-2 text-xs">
                                    {(() => {
                                        const totalPieValue = pieChartData.reduce((acc: number, curr: any) => acc + curr.value, 0);
                                        return pieChartData.map((entry, index) => {
                                            const color = PIE_COLORS[index % PIE_COLORS.length];
                                            const percentage = totalPieValue > 0 ? ((entry.value / totalPieValue) * 100).toFixed(1) : '0.0';
                                            return (
                                                <div key={entry.name} className="flex items-center gap-2 justify-between py-0.5">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                                        <span className="text-gray-600 font-medium truncate" title={entry.name}>
                                                            {entry.name} <span className="text-gray-400 font-normal ml-1">({percentage}%)</span>
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-900 font-semibold tabular-nums ml-2 flex-shrink-0">
                                                        ${entry.value.toLocaleString()}
                                                    </span>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Bottom Section: Table & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card id="tour-recent-clients" className="lg:col-span-2 animate-stagger" style={{ animationDelay: '700ms' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg text-gray-800">Clientes Recientes</h3>
                        <Button variant="outline" onClick={() => navigateTo('clients')} className="text-xs py-1 px-3">Ver todos</Button>
                    </div>
                    {clients.length === 0 ? (
                        <EmptyClientsIllustration title="Sin clientes recientes" description="No hay clientes registrados en el sistema." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-y border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Cliente</th>
                                        <th className="px-4 py-3 font-medium">Empresa</th>
                                        <th className="px-4 py-3 font-medium">Producto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.slice(0, 5).map((client: any, i: number) => {
                                        const clientProducts = (client.services || []).map((s: any) => products.find((p: any) => p.id === s.productId)?.name).filter(Boolean);
                                        const productsLabel = clientProducts.length > 0 ? clientProducts.join(', ') : 'Ninguno';
                                        return (
                                            <tr key={client.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors animate-stagger" style={{ animationDelay: `${800 + i * 50}ms` }}>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-gray-900">{client.name}</div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{client.company || '-'}</td>
                                                <td className="px-4 py-3 text-gray-600 truncate max-w-xs" title={productsLabel}>{productsLabel}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <Card id="tour-team-members" className="animate-stagger" style={{ animationDelay: '800ms' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg text-gray-800">Miembros del Equipo</h3>
                    </div>
                    <div className="space-y-3">
                        {systemUsers.map((member: any, i: number) => {
                            const isOnline = onlineUsers.includes(member.id);
                            return (
                                <div key={member.id || i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100 animate-stagger" style={{ animationDelay: `${900 + i * 50}ms` }}>
                                    <div className="relative">
                                        <img 
                                            src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=f3f4f6&color=374151`} 
                                            alt={member.name} 
                                            className="w-10 h-10 rounded-full border border-gray-200 group-hover:border-[#488fcc] transition-colors object-cover"
                                        />
                                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${isOnline ? 'bg-[#10B981]' : 'bg-gray-300'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors truncate">{member.name}</h4>
                                        <p className="text-xs text-gray-500 truncate flex items-center gap-1.5">
                                            <span>{member.role}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className={isOnline ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
                                                {isOnline ? 'En línea' : 'Desconectado'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ClientsListView = () => {
    const { clients, setClients, navigateTo, profile } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    


    const isAdmin = profile?.role === 'admin';

    const filteredClients = clients.filter((client: any) => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        client.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddClient = (data: any) => {
        const newClient = {
            ...data,
            id: `client_${Date.now()}`,
            number: String(clients.length + 1).padStart(3, '0'),
            dateAdded: new Date().toISOString().split('T')[0]
        };
        setClients([...clients, newClient]);
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div id="tour-clients-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-stagger" style={{ animationDelay: '0ms' }}>
                <SectionTitle 
                    title="Directorio de Clientes" 
                    subtitle="Gestión de expedientes digitales"
                />
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center bg-white px-4 py-2 rounded-xl border border-gray-200 focus-within:border-[#488fcc] transition-colors shadow-sm flex-1 md:w-64">
                        <Search size={16} className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar clientes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm text-gray-700"
                        />
                    </div>
                    <div id="tour-clients-add-btn">
                        <Button icon={<Plus size={16} />} onClick={() => setIsAddModalOpen(true)}>Nuevo Cliente</Button>
                    </div>
                </div>
            </div>

            <div id="tour-clients-grid">
                {filteredClients.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 mb-8">
                        <EmptyClientsIllustration />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map((client: any, i: number) => (
                            <Card key={client.id} className="group cursor-pointer hover:border-[#488fcc]/50 transition-all animate-stagger" style={{ animationDelay: `${100 + i * 50}ms` }} >
                                <div onClick={() => navigateTo('clientProfile', client.id)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xl font-bold group-hover:bg-[#203e71] group-hover:text-white transition-colors">
                                            {client.name.charAt(0)}
                                        </div>
                                        <Badge type={client.status === 'Activo' ? 'success' : 'default'}>{client.status}</Badge>
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{client.name}</h3>
                                    <div className="flex flex-col gap-1 mb-4">
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Building size={14} /> {client.company || 'Sin empresa'}
                                        </p>
                                        <p className="text-xs text-gray-400 flex items-center gap-2">
                                            <Calendar size={14} /> {client.dateAdded ? new Date(client.dateAdded).toLocaleDateString() : 'Sin fecha'}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-gray-400" /> {client.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-gray-400" /> {client.phone}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-medium text-[#488fcc]">
                                        <span>Ver Expediente</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            <ClientFormModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSubmit={handleAddClient} 
            />
        </div>
    );
};

const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'pdf': return <FileText size={32} />;
        case 'doc': case 'docx': case 'txt': return <FileText size={32} />;
        case 'xls': case 'xlsx': case 'csv': return <FileSpreadsheet size={32} />;
        case 'jpg': case 'jpeg': case 'png': case 'gif': case 'svg': case 'webp': return <FileImage size={32} />;
        case 'mp4': case 'mov': case 'avi': return <FileVideo size={32} />;
        case 'mp3': case 'wav': return <FileAudio size={32} />;
        case 'zip': case 'rar': case '7z': case 'tar': return <FileArchive size={32} />;
        case 'js': case 'ts': case 'html': case 'css': case 'json': return <FileCode size={32} />;
        default: return <FileType2 size={32} />;
    }
};

const getFileColor = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'pdf': return 'text-red-500 bg-red-50';
        case 'doc': case 'docx': case 'txt': return 'text-blue-500 bg-blue-50';
        case 'xls': case 'xlsx': case 'csv': return 'text-green-500 bg-green-50';
        case 'jpg': case 'jpeg': case 'png': case 'gif': case 'svg': case 'webp': return 'text-purple-500 bg-purple-50';
        case 'mp4': case 'mov': case 'avi': return 'text-pink-500 bg-pink-50';
        case 'mp3': case 'wav': return 'text-yellow-500 bg-yellow-50';
        case 'zip': case 'rar': case '7z': case 'tar': return 'text-orange-500 bg-orange-50';
        case 'js': case 'ts': case 'html': case 'css': case 'json': return 'text-gray-700 bg-gray-100';
        default: return 'text-gray-500 bg-gray-50';
    }
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const ClientProfileView = () => {
    const { selectedClientId, getClientData, clients, setClients, tasks, setTasks, documents, setDocuments, navigateTo, products, clientActiveTab, setClientActiveTab, previousView, profile } = useContext(AppContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [taskToDelete, setTaskToDelete] = useState<any>(null);
    const [isDeleteClientModalOpen, setIsDeleteClientModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<any[]>([]);
    const [docToDelete, setDocToDelete] = useState<any>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const isAdmin = profile?.role === 'admin';

    const handleOpenDocument = async (doc: any) => {
        try {
            let filePath = doc.url;
            if (filePath && filePath.startsWith('http')) {
                // If it's a full URL (legacy data), try to extract the file path
                const parts = filePath.split('/storage/v1/object/public/documents/');
                if (parts.length > 1) {
                    filePath = parts[1];
                }
            }
            
            if (!filePath) {
                alert('La ruta del archivo no está disponible.');
                return;
            }
            
            const { data, error } = await supabase.storage.from('documents').createSignedUrl(filePath, 60);
            
            if (error) {
                console.error('Error creating signed URL:', error);
                alert('No se pudo generar el enlace para abrir el documento: ' + error.message);
                return;
            }
            
            if (data?.signedUrl) {
                window.open(data.signedUrl, '_blank');
            }
        } catch (e) {
            console.error('Exception opening document:', e);
            alert('Ocurrió un error al intentar abrir el documento.');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesToUpload = Array.from(e.target.files).map((file: File) => {
                const parts = file.name.split('.');
                const ext = parts.length > 1 ? parts.pop() || '' : '';
                const baseName = parts.join('.');
                return {
                    file,
                    customName: baseName,
                    ext: ext,
                    size: formatBytes(file.size)
                };
            });
            setPendingFiles(filesToUpload);
            setIsUploadModalOpen(true);
            
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const confirmUpload = (uploadedFiles: any[]) => {
        const newDocs = uploadedFiles.map(f => {
            const fullFileName = f.ext ? `${f.customName}.${f.ext}` : f.customName;
            const extUpper = f.ext.toUpperCase() || 'UNKNOWN';
            const url = f.file ? URL.createObjectURL(f.file) : '';
            return {
                id: `d${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                clientId: selectedClientId,
                name: fullFileName,
                customName: f.customName,
                ext: f.ext,
                type: extUpper,
                size: f.size,
                url: url,
                file: f.file,
                date: new Date().toISOString().split('T')[0]
            };
        });
        setDocuments([...documents, ...newDocs]);
        setIsUploadModalOpen(false);
        setPendingFiles([]);
    };

    if (!selectedClientId) return <div>No client selected.</div>;

    const { client, clientTasks, clientDocs, clientAccesses, clientCommissions } = getClientData(selectedClientId);
    const clientProduct = products.find((p: any) => p.id === client.productId);

    if (!client) return <div>Client not found.</div>;

    const tabs = [
        { id: 'general', label: 'Aspectos Generales', icon: <User size={16} /> },
        { id: 'docs', label: 'Documentos', icon: <FileText size={16} /> },
        { id: 'tasks', label: 'Tareas', icon: <CheckCircle size={16} /> }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2 animate-stagger" style={{ animationDelay: '0ms' }}>
                <button 
                    onClick={() => navigateTo(previousView === 'tasks_global' ? 'tasks_global' : 'clients')} 
                    className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
                    title="Volver"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <button onClick={() => navigateTo(previousView === 'tasks_global' ? 'tasks_global' : 'clients')} className="hover:text-gray-900 transition-colors">
                        {previousView === 'tasks_global' ? 'Tareas' : 'Clientes'}
                    </button>
                    <ChevronRight size={14} />
                    <span className="font-medium text-gray-900">{client.number}#</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-stagger" style={{ animationDelay: '100ms' }}>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1"><Building size={16} /> {client.company || 'Sin empresa'}</span>
                        <span className="flex items-center gap-1"><Calendar size={16} /> Registrado: {client.dateAdded ? new Date(client.dateAdded).toLocaleDateString() : 'Sin fecha'}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" icon={<Edit2 size={16} />} onClick={() => setIsEditModalOpen(true)}>Editar</Button>
                    {isAdmin && (
                        <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:border-red-200" icon={<Trash2 size={16} />} onClick={() => setIsDeleteClientModalOpen(true)}>Eliminar</Button>
                    )}
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit animate-stagger" style={{ animationDelay: '200ms' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setClientActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            clientActiveTab === tab.id 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Areas */}
            <div className="mt-6">
                {clientActiveTab === 'general' && (
                    <div className="space-y-6">
                        {/* Info Principal */}
                        <Card className="space-y-6 animate-stagger" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-lg font-semibold border-b border-gray-100 pb-2">Información Principal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Correo Electrónico</label>
                                    <p className="mt-1 font-medium text-gray-900 flex items-center gap-2">
                                        {client.email} <Copy size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Teléfono</label>
                                    <p className="mt-1 font-medium text-gray-900">{client.phone}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold border-b border-gray-100 pb-2 pt-4">Detalles del Servicio</h3>
                            <div className="grid grid-cols-1 gap-y-4">
                                {client.services && client.services.length > 0 ? (
                                    client.services.map((service: any, idx: number) => {
                                        const prod = products.find((p: any) => p.id === service.productId);
                                        return (
                                            <div key={idx} className="flex flex-col md:flex-row justify-between md:items-center bg-gray-50 p-4 rounded-xl border border-gray-100 gap-4">
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Producto Contratado</label>
                                                    <p className="mt-1 font-medium text-gray-900 flex items-center gap-2">
                                                        <Package size={16} className="text-[#488fcc]" /> {prod?.name || 'Desconocido'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Monto Acordado</label>
                                                    <p className="mt-1 font-medium text-gray-900">${service.amount}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Estado</label>
                                                    <div className="mt-1"><Badge type="success">{client.status}</Badge></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-2 border border-gray-100 rounded-2xl bg-white mt-4">
                                        <EmptyServicesIllustration title="Sin servicios" description="Este cliente no tiene servicios asignados aún." />
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mt-2">Fecha de Registro</label>
                                    <p className="mt-1 font-medium text-gray-900">{client.date}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {}
                {clientActiveTab === 'docs' && (
                     <div>
                         <div className="flex justify-between items-center mb-6 animate-stagger" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-lg font-semibold">Gestor Documental</h3>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                multiple
                            />
                            <Button icon={<Upload size={16} />} onClick={() => fileInputRef.current?.click()}>
                                Subir Archivo
                            </Button>
                         </div>
                         
                         {clientDocs.length === 0 ? (
                             <div className="bg-white rounded-2xl border border-gray-100 mb-8 py-8">
                                 <EmptyImageIllustration />
                             </div>
                         ) : (
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {clientDocs.map((doc: any, i: number) => (
                                    <Card key={doc.id} className="flex flex-col items-center p-4 text-center group hover:border-blue-200 animate-stagger cursor-pointer" style={{ animationDelay: `${400 + i * 50}ms` }} onClick={() => handleOpenDocument(doc)}>
                                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${getFileColor(doc.name)}`}>
                                            {getFileIcon(doc.name)}
                                        </div>
                                        <h4 className="text-sm font-medium text-gray-800 truncate w-full" title={doc.name}>{doc.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{doc.type} • {doc.size}</p>
                                        
                                        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                className="p-1.5 bg-red-50 rounded-lg text-red-500 hover:bg-red-100" 
                                                title="Eliminar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDocToDelete(doc);
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </Card>
                                ))}
                             </div>
                         )}
                     </div>
                )}

                {}
                {clientActiveTab === 'tasks' && (
                     <div>
                         <div className="flex justify-between items-center mb-6 animate-stagger" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-lg font-semibold">Tareas del Cliente</h3>
                            <Button icon={<Plus size={16} />} onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}>Nueva Tarea</Button>
                         </div>

                         <div className="space-y-8">
                             {/* Pendientes */}
                             <div>
                                 <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider animate-stagger" style={{ animationDelay: '350ms' }}>Pendientes</h4>
                                 <div className="space-y-3">
                                     {clientTasks.filter((t: any) => t.status !== 'Finalizada').map((task: any, i: number) => (
                                         <Card key={task.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 hover:border-gray-300 transition-colors animate-stagger" style={{ animationDelay: `${400 + i * 100}ms` }}>
                                             <div className="flex items-start gap-4">
                                                <button onClick={() => {
                                                    const updatedTasks = tasks.map((t: any) => t.id === task.id ? { ...t, status: 'Finalizada' } : t);
                                                    setTasks(updatedTasks);
                                                }} className="mt-1 h-8 w-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 focus:outline-none transition-colors border-gray-300 hover:border-gray-400">
                                                </button>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                                        
                                                        {task.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 font-medium">
                                                        <span className="flex items-center gap-1"><User size={12}/> {task.assignee}</span>
                                                        <span className="flex items-center gap-1"><Clock size={12}/> {task.date}</span>
                                                        <Badge type={task.priority === 'Alta' ? 'danger' : 'warning'}>{task.priority}</Badge>
                                                    </div>
                                                </div>
                                             </div>
                                             <div className="mt-4 sm:mt-0 flex gap-2">
                                                <Button variant="ghost" className="p-2" onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }}><Edit2 size={16}/></Button>
                                                {isAdmin && (
                                                    <Button variant="ghost" className="p-2 text-red-500 hover:text-red-700" onClick={() => setTaskToDelete(task)}><Trash2 size={16}/></Button>
                                                )}
                                             </div>
                                         </Card>
                                     ))}
                                     {clientTasks.filter((t: any) => t.status !== 'Finalizada').length === 0 && (
                                        <div className="bg-white rounded-2xl border border-gray-100 mt-4">
                                            <EmptyTasksIllustration title="Sin tareas pendientes" description="No hay tareas pendientes asignadas." />
                                        </div>
                                    )}
                                 </div>
                             </div>

                             {/* Finalizadas */}
                             {clientTasks.filter((t: any) => t.status === 'Finalizada').length > 0 && (
                                 <div>
                                     <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider animate-stagger" style={{ animationDelay: '500ms' }}>Finalizadas</h4>
                                     <div className="space-y-3 opacity-80">
                                         {clientTasks.filter((t: any) => t.status === 'Finalizada').map((task: any, i: number) => (
                                             <Card key={task.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-gray-50 hover:border-gray-300 transition-colors animate-stagger" style={{ animationDelay: `${600 + i * 100}ms` }}>
                                                 <div className="flex items-start gap-4">
                                                    <button onClick={() => {
                                                        const updatedTasks = tasks.map((t: any) => t.id === task.id ? { ...t, status: 'Pendiente' } : t);
                                                        setTasks(updatedTasks);
                                                    }} className="mt-1 h-8 w-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 focus:outline-none transition-colors bg-green-500 border-green-500">
                                                        <CheckCircle size={20} className="text-white" />
                                                    </button>
                                                    <div>
                                                        <h4 className="font-medium text-gray-500 line-through flex items-center gap-2">
                                                            
                                                            {task.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1 line-through">{task.description}</p>
                                                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 font-medium">
                                                            <span className="flex items-center gap-1"><User size={12}/> {task.assignee}</span>
                                                            <span className="flex items-center gap-1"><Clock size={12}/> {task.date}</span>
                                                            <Badge type={task.priority === 'Alta' ? 'danger' : 'warning'}>{task.priority}</Badge>
                                                        </div>
                                                    </div>
                                                 </div>
                                                 <div className="mt-4 sm:mt-0 flex gap-2">
                                                    <Button variant="ghost" className="p-2" onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }}><Edit2 size={16}/></Button>
                                                    {isAdmin && (
                                                        <Button variant="ghost" className="p-2 text-red-500 hover:text-red-700" onClick={() => setTaskToDelete(task)}><Trash2 size={16}/></Button>
                                                    )}
                                                 </div>
                                             </Card>
                                         ))}
                                     </div>
                                 </div>
                             )}
                         </div>
                     </div>
                )}
            </div>

            <TaskFormModal 
                isOpen={isTaskModalOpen} 
                onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
                clientId={client.id}
                initialData={editingTask}
                onSubmit={(data: any) => {
                    if (editingTask) {
                        const updatedTasks = tasks.map((t: any) => t.id === editingTask.id ? { ...t, ...data } : t);
                        setTasks(updatedTasks);
                    } else {
                        const newTask = {
                            ...data,
                            id: `${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}#`,
                            date: data.date || new Date().toISOString().split('T')[0]
                        };
                        setTasks([...tasks, newTask]);
                    }
                    setIsTaskModalOpen(false);
                    setEditingTask(null);
                }}
            />

            <ClientFormModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                onSubmit={(data: any) => {
                    const updatedClients = clients.map((c: any) => c.id === selectedClientId ? { ...c, ...data } : c);
                    setClients(updatedClients);
                    setIsEditModalOpen(false);
                }}
                initialData={client}
            />

            <UploadFormModal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setPendingFiles([]);
                }}
                onSubmit={confirmUpload}
                initialFiles={pendingFiles}
            />

            
            
            <ConfirmDeleteModal 
                isOpen={!!docToDelete}
                onClose={() => setDocToDelete(null)}
                onConfirm={() => {
                    if (docToDelete) {
                        setDocuments(documents.filter((d: any) => d.id !== docToDelete.id));
                        setDocToDelete(null);
                    }
                }}
                itemName={docToDelete?.name || ''}
                title="¿Eliminar Archivo?"
                description="¿Estás seguro de que deseas eliminar el archivo"
            />

            <ConfirmDeleteModal 
                isOpen={isDeleteClientModalOpen}
                onClose={() => setIsDeleteClientModalOpen(false)}
                onConfirm={() => {
                    setClients(clients.filter((c: any) => c.id !== selectedClientId));
                    setIsDeleteClientModalOpen(false);
                    navigateTo('clients');
                }}
                itemName={client.name}
                title="¿Eliminar Cliente?"
                description="¿Estás seguro de que deseas eliminar permanentemente a este cliente? Se borrarán sus tareas y documentos."
            />

            <ConfirmDeleteModal 
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={() => {
                    if (taskToDelete) {
                        setTasks(tasks.filter((t: any) => t.id !== taskToDelete.id));
                        setTaskToDelete(null);
                    }
                }}
                itemName={taskToDelete?.name || ''}
                title="¿Eliminar Tarea?"
                description="¿Estás seguro de que deseas eliminar la tarea"
            />
        </div>
    );
};

const GenericListView = ({ 
    title, 
    description, 
    columns, 
    data, 
    icon: Icon, 
    onAddClick, 
    addLabel = 'Nuevo Registro', 
    addBtnId,
    onEditClick, 
    onDeleteClick, 
    onRowClick, 
    headerContent, 
    hideActions = false 
}: any) => {
    return (
        <div className="space-y-6">
            <SectionTitle 
                title={title} 
                subtitle={description}
                action={
                    addBtnId ? (
                        <div id={addBtnId}>
                            <Button icon={<Plus size={16} />} onClick={onAddClick || (() => {})}>{addLabel}</Button>
                        </div>
                    ) : onAddClick ? (
                        <Button icon={<Plus size={16} />} onClick={onAddClick}>{addLabel}</Button>
                    ) : null
                }
                className="animate-stagger" style={{ animationDelay: '0ms' }}
            />
            {headerContent && (
                <div className="animate-stagger" style={{ animationDelay: '50ms' }}>
                    {headerContent}
                </div>
            )}
            <Card noPadding className="animate-stagger" style={{ animationDelay: '100ms' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                {columns.map((col: any, i: number) => <th key={i} className="px-6 py-4 font-medium">{col.header}</th>)}
                                {!hideActions && <th className="px-6 py-4 text-right">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + (hideActions ? 0 : 1)} className="py-12">
                                        <EmptyLogsIllustration title="Sin Registros" description="No se encontraron registros de datos." />
                                    </td>
                                </tr>
                            ) : data.map((row: any, i: number) => (
                                <tr 
                                    key={i} 
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    className={`hover:bg-gray-50/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`} 
                                >
                                    {columns.map((col: any, j: number) => (
                                        <td key={j} className="px-6 py-4">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                    {!hideActions && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                {onEditClick && (
                                                    <button 
                                                        onClick={() => onEditClick(row)} 
                                                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                )}
                                                {onDeleteClick && (
                                                    <button 
                                                        onClick={() => onDeleteClick(row)} 
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                                {!onEditClick && !onDeleteClick && (
                                                    <button 
                                                        className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
                                                    >
                                                        <MoreVertical size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const ServiceFormModal = ({ isOpen, onClose, onSubmit, initialData = null }: any) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        commissionRate: '',
        status: 'Activo'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                commissionRate: initialData.commissionRate || '',
                status: initialData.status || 'Activo'
            });
        } else {
            setFormData({ name: '', description: '', price: '', commissionRate: '', status: 'Activo' });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            price: Number(formData.price),
            commissionRate: Number(formData.commissionRate)
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/15 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">{initialData ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent bg-white" placeholder="Ej. Contabilidad Mensual" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent bg-white" placeholder="Breve descripción..."></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base ($)</label>
                            <input required type="number" min="0" step="any" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent bg-white" placeholder="Ej. 500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comisión (%)</label>
                            <input required type="number" min="0" max="100" step="any" value={formData.commissionRate} onChange={e => setFormData({...formData, commissionRate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent bg-white" placeholder="Ej. 10" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488fcc] focus:border-transparent bg-white">
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="primary">Guardar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName, title = '¿Eliminar Servicio?', description = '¿Estás seguro de que deseas eliminar el servicio' }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/15 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
                        <Trash2 size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        {description} <span className="font-semibold text-gray-900">"{itemName}"</span>? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <button 
                            onClick={onConfirm} 
                            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-medium transition-colors text-sm bg-red-600 hover:bg-red-700 text-white shadow-sm"
                        >
                            <Trash2 size={16} />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductsView = () => {
    const { products, setProducts, profile } = useContext(AppContext);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [serviceToDelete, setServiceToDelete] = useState<any>(null);

    const isAdmin = profile?.role === 'admin';

    const columns = [
        { header: 'Nombre del Servicio', accessor: 'name', render: (r: any) => <span className="font-medium text-gray-900">{r.name}</span> },
        { header: 'Descripción', accessor: 'description', render: (r: any) => <span className="text-gray-500">{r.description}</span> },
        { header: 'Precio Base', accessor: 'price', render: (r: any) => `$${r.price}` },
        { header: 'Comisión (%)', accessor: 'commissionRate', render: (r: any) => `${r.commissionRate}%` },
        { header: 'Estado', accessor: 'status', render: (r: any) => <Badge type={r.status === 'Activo' ? 'success' : 'default'}>{r.status}</Badge> }
    ];

    const handleSubmit = (data: any) => {
        if (editingService) {
            const updated = products.map((p: any) => p.id === editingService.id ? { ...p, ...data } : p);
            setProducts(updated);
        } else {
            const newId = `p${Math.floor(Math.random() * 1000) + 4}`;
            const newService = {
                id: newId,
                ...data
            };
            setProducts([...products, newService]);
        }
        setIsServiceModalOpen(false);
        setEditingService(null);
    };

    const handleDeleteConfirm = () => {
        if (serviceToDelete) {
            const updated = products.filter((p: any) => p.id !== serviceToDelete.id);
            setProducts(updated);
            setServiceToDelete(null);
        }
    };

    return (
        <>
            <GenericListView 
                title="Catálogo de Servicios" 
                description="Gestión de productos y servicios ofrecidos" 
                columns={columns} 
                data={products}
                addLabel="Nuevo Servicio"
                addBtnId="tour-products-add-btn"
                onAddClick={isAdmin ? () => { setEditingService(null); setIsServiceModalOpen(true); } : undefined}
                onEditClick={isAdmin ? (service: any) => { setEditingService(service); setIsServiceModalOpen(true); } : undefined}
                onDeleteClick={isAdmin ? (service: any) => setServiceToDelete(service) : undefined}
                hideActions={!isAdmin}
            />
            <ServiceFormModal 
                isOpen={isServiceModalOpen}
                onClose={() => { setIsServiceModalOpen(false); setEditingService(null); }}
                onSubmit={handleSubmit}
                initialData={editingService}
            />
            <ConfirmDeleteModal 
                isOpen={!!serviceToDelete}
                onClose={() => setServiceToDelete(null)}
                onConfirm={handleDeleteConfirm}
                itemName={serviceToDelete?.name || ''}
            />
        </>
    );
};

const CommissionsView = () => {
    return (
        <div className="space-y-6">
            <SectionTitle 
                title="Control de Comisiones" 
                subtitle="Registro histórico de comisiones generadas"
            />
            <Card className="flex flex-col items-center justify-center py-24 bg-white">
                <div className="text-gray-200 mb-3">
                    <DollarSign size={48} strokeWidth={1} />
                </div>
                <p className="text-gray-400 text-sm font-medium">Sección de comisiones en blanco</p>
            </Card>
        </div>
    );
};

const GlobalTasksView = () => {
    const { tasks, setTasks, clients, navigateTo } = useContext(AppContext);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [filterType, setFilterType] = useState<string>('Pendientes');
    
    const displayData = tasks.map((t: any) => ({
        ...t,
        clientName: clients.find((c: any) => c.id === t.clientId)?.name || 'General'
    }))
    .filter((t: any) => {
        if (filterType === 'Todas') return true;
        if (filterType === 'Finalizadas') return t.status === 'Finalizada';
        if (filterType === 'Pendientes') return t.status !== 'Finalizada';
        return t.priority === filterType && t.status !== 'Finalizada';
    })
    .sort((a: any, b: any) => {
        // Sort primarily by date (closest to furthest)
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        if (dateA !== dateB) return dateA - dateB;
        // Then sort by priority if dates are identical
        const priorityOrder: any = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
        return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    });

    const columns = [
        { header: 'Tarea', accessor: 'name', render: (r: any) => (
            <div className={`font-medium flex items-center gap-2 ${r.status === 'Finalizada' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {r.status === 'Finalizada' && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                <span>{r.name}</span>
            </div>
        ) },
        { header: 'Cliente', accessor: 'clientName', render: (r: any) => <span className={r.status === 'Finalizada' ? 'text-gray-400' : 'text-gray-600'}>{r.clientName}</span> },
        
        { header: 'Responsable', accessor: 'assignee', render: (r: any) => <span className={`flex items-center gap-1.5 ${r.status === 'Finalizada' ? 'text-gray-400' : 'text-gray-600'}`}><User size={14} className={r.status === 'Finalizada' ? 'text-gray-300' : 'text-gray-400'}/> {r.assignee}</span> },
        { header: 'Prioridad', accessor: 'priority', render: (r: any) => (
            <div className={r.status === 'Finalizada' ? 'opacity-50' : ''}>
                <Badge type={r.priority === 'Alta' ? 'danger' : r.priority === 'Media' ? 'warning' : 'info'}>{r.priority}</Badge>
            </div>
        ) },
        { header: 'Vencimiento', accessor: 'date', render: (r: any) => <span className={r.status === 'Finalizada' ? 'text-gray-400' : 'text-gray-600'}>{r.date}</span> }
    ];

    const filterHeader = (
        <div id="tour-tasks-filters" className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-lg overflow-x-auto hide-scrollbar border border-gray-100">
                {['Pendientes', 'Finalizadas'].map(p => (
                    <button 
                        key={p}
                        onClick={() => setFilterType(p)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                            filterType === p 
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Prioridad:</span>
                {['Alta', 'Media', 'Baja'].map(p => (
                    <button 
                        key={p}
                        onClick={() => setFilterType(p)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            filterType === p 
                            ? (p === 'Alta' ? 'bg-red-100 text-red-700' : p === 'Media' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700')
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <GenericListView 
                title="Gestor de Tareas" 
                description="Control global de tareas y asignaciones" 
                columns={columns} 
                data={displayData} 
                headerContent={filterHeader}
                addLabel="Nueva Tarea"
                addBtnId="tour-tasks-add-btn"
                onAddClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
                hideActions={true}
                onRowClick={(task: any) => {
                    if (task.clientId) {
                        navigateTo('clientProfile', task.clientId, 'tasks');
                    }
                }}
            />
            <TaskFormModal 
                isOpen={isTaskModalOpen} 
                onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
                initialData={editingTask}
                onSubmit={(data: any) => {
                    if (editingTask) {
                        const updatedTasks = tasks.map((t: any) => t.id === editingTask.id ? { ...t, ...data } : t);
                        setTasks(updatedTasks);
                    } else {
                        const newTask = {
                            ...data,
                            id: `${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}#`,
                            date: data.date || new Date().toISOString().split('T')[0]
                        };
                        setTasks([...tasks, newTask]);
                    }
                    setIsTaskModalOpen(false);
                    setEditingTask(null);
                }}
            />
        </>
    );
};

// --- GLOBAL TOAST NOTIFICATION COMPONENT ---
const GlobalToast = ({ toast, onClose }: { toast: any; onClose: () => void }) => {
    return (
        <AnimatePresence>
            {toast && toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-6 right-6 z-[99999] flex items-center gap-3.5 bg-white border border-emerald-100 shadow-[0_16px_40px_-8px_rgba(16,185,129,0.22)] rounded-3xl p-3 pr-5 max-w-sm sm:max-w-md antialiased pointer-events-auto overflow-hidden"
                >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50/80 flex items-center justify-center flex-shrink-0 overflow-hidden border border-emerald-100">
                        <SuccessSpotIllustration className="w-20 h-14 scale-90 translate-y-0.5" />
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                        <h4 className="text-[14px] font-bold text-slate-900 leading-snug">{toast.title}</h4>
                        {toast.message && (
                            <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
                        )}
                    </div>
                    <button 
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-1"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- UNSAVED CHANGES PROTECTION MODAL ---
const UnsavedChangesModal = ({ 
    isOpen, 
    onSave, 
    onDiscard, 
    onCancel, 
    isSaving 
}: { 
    isOpen: boolean; 
    onSave: () => void; 
    onDiscard: () => void; 
    onCancel: () => void; 
    isSaving: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl max-w-[400px] w-full p-8 sm:p-9 shadow-2xl border border-slate-100 relative overflow-hidden text-center flex flex-col items-center animate-in zoom-in-95 duration-200"
            >
                {/* Close button X */}
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                    <X size={18} />
                </button>

                {/* Top Spot Illustration */}
                <div className="mt-1 mb-3 flex items-center justify-center">
                    <UnsavedWarningSpotIllustration />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
                    ¿Deseas guardar los cambios antes de salir?
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-7 max-w-[300px]">
                    Tienes modificaciones pendientes. Si sales ahora sin guardar, se perderán los datos ingresados.
                </p>

                {/* Action Buttons: CANCELAR, DESCARTAR, GUARDAR */}
                <div className="flex items-center justify-center gap-2.5 w-full max-w-[340px]">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all border border-slate-200/80 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onDiscard}
                        disabled={isSaving}
                        className="flex-1 py-3 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-2xl transition-all border border-amber-200/60 disabled:opacity-50"
                    >
                        Descartar
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex-1 py-3 px-3 bg-[#203e71] hover:bg-[#183059] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span>Guardar</span>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const SettingsView = () => {
    const { 
        profile, setProfile, business, setBusiness, 
        systemUsers, setSystemUsers, user: currentUser, 
        onlineUsers, showToast, setUnsavedChangesGuard 
    } = useContext(AppContext);

    // --- LOGOUT MODAL STATE ---
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // --- MOCKUP STATE MANAGEMENT ---
    const [fullName, setFullName] = useState(profile.name || '');
    const [dob, setDob] = useState('7 July 2002');
    const [gender, setGender] = useState<'Male' | 'Female'>('Male');
    const [mobile, setMobile] = useState('+62 821 1234 1234');
    const [email, setEmail] = useState(profile.email || '');
    const [weight, setWeight] = useState('64');
    const [height, setHeight] = useState('175,5');
    const [tempPhoto, setTempPhoto] = useState(profile.photo || '');

    // --- ERP PREFERENCES STATE ---
    const [erpName, setErpName] = useState(business.name || 'Mauricio ERP Servicios');
    const [erpLogo, setErpLogo] = useState(business.logo || '');
    const [taxId, setTaxId] = useState('NIT 901.442.885-3');
    const [currency, setCurrency] = useState('USD');
    const [sector, setSector] = useState('Servicios Corporativos');
    const [prefix, setPrefix] = useState('CLI-');
    const [timezone, setTimezone] = useState('America/Bogota');

    const [isSaving, setIsSaving] = useState(false);
    const [activeHighlight, setActiveHighlight] = useState('Mi Cuenta');

    // --- CROP STATE ---
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<string> => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject();
                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;
                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            image.onerror = (error) => reject(error);
        });
    };

    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
            if (activeHighlight === 'Usuarios') {
                setUserFormPhoto(croppedImage);
            } else {
                setTempPhoto(croppedImage);
            }
            setCropModalOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    // --- USUARIOS LOCAL MANAGEMENT ---
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [userFormName, setUserFormName] = useState('');
    const [userFormEmail, setUserFormEmail] = useState('');
    const [userFormRole, setUserFormRole] = useState('Usuario');
    const [userFormStatus, setUserFormStatus] = useState('Activo');
    const [userFormPhoto, setUserFormPhoto] = useState('');

    const handleUserFormPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleAddOrEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingUser) {
                await supabase.from('perfiles').update({ rol: userFormRole.toLowerCase() }).eq('id', editingUser.id);
                setSystemUsers((prev: any[]) => prev.map((u) => u.id === editingUser.id ? {
                    ...u,
                    role: userFormRole
                } : u));
                setEditingUser(null);
                showToast('Usuario actualizado con éxito', 'Los permisos del usuario fueron modificados correctamente.');
            }

            setUserFormName('');
            setUserFormEmail('');
            setUserFormRole('Usuario');
            setUserFormStatus('Activo');
            setUserFormPhoto('');
        } catch (error: any) {
            console.error('Error al guardar usuario:', error);
            setAlertMessage(error.message || 'Error al guardar el usuario');
        } finally {
            setIsSaving(false);
        }
    };

    const handleStartEditUser = (userToEdit: any) => {
        if (userToEdit.role === 'Admin' && userToEdit.id !== currentUser?.id) {
            setAlertMessage('No tienes permisos para editar a otro Administrador.');
            return;
        }
        setEditingUser(userToEdit);
        setIsAddingUser(false);
        setUserFormName(userToEdit.name);
        setUserFormEmail(userToEdit.email);
        setUserFormRole(userToEdit.role);
        setUserFormStatus(userToEdit.status);
        setUserFormPhoto(userToEdit.photo || '');
    };

    const handleDeleteUser = (userId: string) => {
        if (userId === currentUser?.id) {
            setAlertMessage('No puedes eliminar tu propio usuario.');
            return;
        }
        const u = systemUsers.find((x: any) => x.id === userId);
        if (u) {
            if (u.role === 'Admin') {
                setAlertMessage('No se puede eliminar a otro Administrador.');
                return;
            }
            setUserToDelete(u);
        }
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setIsSaving(true);
        try {
            await supabase.from('perfiles').delete().eq('id', userToDelete.id);
            setSystemUsers((prev: any[]) => prev.filter((u) => u.id !== userToDelete.id));
            if (editingUser && editingUser.id === userToDelete.id) {
                setEditingUser(null);
                setIsAddingUser(false);
            }
            setUserToDelete(null);
        } catch (error: any) {
            console.error('Error al eliminar usuario:', error);
            setAlertMessage('No se pudo eliminar el usuario.');
        } finally {
            setIsSaving(false);
        }
    };

    // Sync state if context changes
    useEffect(() => {
        setFullName(profile.name || '');
        setEmail(profile.email || '');
        setTempPhoto(profile.photo || '');
    }, [profile]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    
    const handlePasswordReset = async () => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/?type=recovery`,
            });
            if (error) throw error;
            alert('Se ha enviado un enlace a tu correo para restablecer la contraseña.');
        } catch (error: any) {
            console.error('Error enviando correo de restablecimiento:', error.message);
            alert('Hubo un error al enviar el enlace. Inténtalo de nuevo.');
        }
    };

    // Detect unsaved changes
    const hasProfileChanged = 
        (fullName.trim() !== (profile.name || '').trim()) || 
        (email.trim() !== (profile.email || '').trim()) || 
        (tempPhoto !== (profile.photo || ''));

    const hasErpChanged = 
        (erpName.trim() !== (business.name || '').trim()) || 
        (erpLogo !== (business.logo || ''));

    const hasUnsavedChanges = hasProfileChanged || hasErpChanged;

    const handleSaveProfileInternal = async () => {
        if (!hasProfileChanged) return;
        setIsSaving(true);
        try {
            await setProfile({
                ...profile,
                name: fullName,
                email: email,
                photo: tempPhoto
            });
            setSystemUsers((prev: any[]) => prev.map(u => 
                (u.email === profile.email || u.id === currentUser?.id) 
                ? { ...u, name: fullName, photo: tempPhoto } 
                : u
            ));
            setUnsavedChangesGuard(null);
            showToast('Perfil actualizado con éxito', 'Se han guardado los cambios en tu foto y datos personales.');
        } catch (error) {
            console.error(error);
            showToast('Error al guardar', 'No se pudieron guardar los datos de perfil.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        await handleSaveProfileInternal();
    };

    const handleSaveErpSettingsInternal = async () => {
        if (!hasErpChanged) return;
        setIsSaving(true);
        try {
            setBusiness({
                name: erpName,
                logo: erpLogo
            });
            setUnsavedChangesGuard(null);
            showToast('Configuración guardada con éxito', 'Los datos de la empresa se han actualizado correctamente.');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setFullName(profile.name || '');
        setEmail(profile.email || '');
        setTempPhoto(profile.photo || '');
        setErpName(business.name || '');
        setErpLogo(business.logo || '');
        setUnsavedChangesGuard(null);
    };

    useEffect(() => {
        if (hasUnsavedChanges) {
            setUnsavedChangesGuard({
                hasChanges: true,
                saveHandler: async () => {
                    if (hasProfileChanged) await handleSaveProfileInternal();
                    if (hasErpChanged) await handleSaveErpSettingsInternal();
                },
                resetHandler: () => {
                    handleCancelEdit();
                }
            });
        } else {
            setUnsavedChangesGuard(null);
        }
    }, [fullName, email, tempPhoto, erpName, erpLogo, profile, business, hasUnsavedChanges, hasProfileChanged, hasErpChanged]);

    useEffect(() => {
        return () => {
            setUnsavedChangesGuard(null);
        };
    }, []);

    return (
        <div className="space-y-6 animate-stagger" style={{ animationDelay: '0ms' }}>
            <div className="bg-white rounded-3xl md:rounded-[2rem] border border-gray-200 shadow-sm flex flex-col lg:flex-row overflow-hidden min-h-[700px]">
                {/* SIDEBAR */}
                <div className="w-full lg:w-[280px] bg-[#FAFAFA] lg:border-r border-b lg:border-b-0 border-gray-200 flex flex-col flex-shrink-0">
                    {/* Profile Info */}
                    <div className="p-6 flex items-center gap-4 border-b border-gray-200">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 border border-gray-200 flex-shrink-0">
                            {tempPhoto ? (
                                <img src={tempPhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium text-[15px]">
                                    {fullName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="text-[15px] font-medium text-gray-900">{fullName}</span>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 py-6">
                        <div className="mb-8">
                            <div className="px-6 mb-2 text-[13px] text-gray-400 font-medium">Tu cuenta</div>
                            <div className="px-3">
                                <button
                                    onClick={() => setActiveHighlight('Mi Cuenta')}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-[14px] font-medium transition-colors ${activeHighlight === 'Mi Cuenta' ? 'bg-[#F3F4F6] text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <User size={18} />
                                    Mi Cuenta
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-8">
                            <div className="px-6 mb-2 text-[13px] text-gray-400 font-medium">Gestión</div>
                            <div className="px-3 space-y-1">
                                {profile.role === 'admin' && (
                                    <button
                                        onClick={() => setActiveHighlight('Usuarios')}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-[14px] font-medium transition-colors ${activeHighlight === 'Usuarios' ? 'bg-[#F3F4F6] text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <Users size={18} />
                                        Usuarios
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-3 border-t border-gray-200">
                         <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-[14px] font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                             <LogOut size={18} />
                             Cerrar sesión
                         </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                    {/* Header */}
                    <div className="px-10 py-8 border-b border-gray-200">
                        <h1 className="text-[26px] font-semibold text-gray-900">
                           {activeHighlight === 'Mi Cuenta' ? 'Mi Cuenta' : 'Usuarios'}
                        </h1>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-10">
                        {activeHighlight === 'Mi Cuenta' && (
                            <div className="max-w-2xl">
                                {/* Profile Picture Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-6 border-b border-gray-200 pb-10">
                                    <div className="text-[15px] font-medium text-gray-900">Foto de Perfil</div>
                                    <div className="flex items-start gap-6">
                                        <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                            {tempPhoto ? (
                                                <img src={tempPhoto} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-xl">
                                                    {fullName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[14px] font-medium rounded-lg cursor-pointer transition-colors shadow-sm">
                                                    <Upload size={16} />
                                                    Subir Imagen
                                                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Name fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-200 py-10">
                                    <div>
                                        <label className="block text-[14px] font-medium text-gray-900 mb-2">Nombre</label>
                                        <input 
                                            type="text" 
                                            value={fullName.split(' ')[0] || ''} 
                                            onChange={(e) => {
                                                const parts = fullName.split(' ');
                                                parts[0] = e.target.value;
                                                setFullName(parts.join(' '));
                                            }} 
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-medium text-gray-900 mb-2">Apellidos</label>
                                        <input 
                                            type="text" 
                                            value={fullName.split(' ').slice(1).join(' ') || ''} 
                                            onChange={(e) => {
                                                const parts = fullName.split(' ');
                                                const newLast = e.target.value;
                                                setFullName(parts[0] + (newLast ? ' ' + newLast : ''));
                                            }} 
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all" 
                                        />
                                    </div>
                                </div>

                                                                {/* Email field */}
                                <div className="grid grid-cols-1 gap-4 items-end py-10 border-b border-gray-200">
                                    <div className="w-full">
                                        <label className="block text-[14px] font-medium text-gray-900 mb-2">Correo Electrónico</label>
                                        <input 
                                            type="email" 
                                            value={email} 
                                            readOnly 
                                            className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[14px] text-gray-600 focus:outline-none transition-all cursor-not-allowed" 
                                        />
                                        <div className="text-[13px] text-gray-400 mt-2">Usado para iniciar sesión en tu cuenta</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* 3. USUARIOS */}
                        {activeHighlight === 'Usuarios' && (
                            <div className="max-w-4xl">
                                {editingUser ? (
                                    <form onSubmit={handleAddOrEditUser} className="space-y-6">
                                        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                                            <h4 className="text-[18px] font-semibold text-gray-900">
                                                Editar Rol de Usuario
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingUser(null);
                                                }}
                                                className="text-gray-400 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-6 border-b border-gray-200 pb-10">
                                            <div className="text-[15px] font-medium text-gray-900">Perfil de Usuario</div>
                                            <div className="flex items-center gap-6">
                                                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                                                    {userFormPhoto ? (
                                                        <img src={userFormPhoto} alt="User Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full text-gray-400 font-medium text-xl flex items-center justify-center">
                                                            {userFormName ? userFormName.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <h5 className="text-[15px] font-medium text-gray-900">{userFormName}</h5>
                                                    <p className="text-[13px] text-gray-500">{userFormEmail}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-6 py-4">
                                            <div className="text-[15px] font-medium text-gray-900 mt-2">Permisos de Rol</div>
                                            <div className="space-y-3">
                                                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                                                    <button
                                                        type="button"
                                                        onClick={() => setUserFormRole('Admin')}
                                                        className={`flex-1 p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${userFormRole === 'Admin' ? 'border-amber-400 bg-amber-50/50 shadow-sm ring-2 ring-amber-400/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <RoleBadge role="Admin" size="sm" />
                                                        </div>
                                                        {userFormRole === 'Admin' && <CheckCircle2 size={16} className="text-amber-600" />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setUserFormRole('Usuario')}
                                                        className={`flex-1 p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${userFormRole === 'Usuario' ? 'border-slate-400 bg-slate-50 shadow-sm ring-2 ring-slate-400/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <RoleBadge role="Usuario" size="sm" />
                                                        </div>
                                                        {userFormRole === 'Usuario' && <CheckCircle2 size={16} className="text-slate-600" />}
                                                    </button>
                                                </div>
                                                <p className="text-[13px] text-gray-400">
                                                    Los administradores tienen acceso completo a la configuración del negocio y gestión de usuarios.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                            {editingUser && editingUser.id !== currentUser?.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUser(editingUser.id)}
                                                    className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 font-medium rounded-lg text-[14px] transition-colors border border-red-200 mr-auto"
                                                >
                                                    Eliminar Usuario
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsAddingUser(false);
                                                    setEditingUser(null);
                                                }}
                                                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-[14px] transition-colors shadow-sm"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium rounded-lg text-[14px] transition-colors shadow-sm disabled:opacity-50"
                                            >
                                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="border border-gray-200 rounded-[16px] overflow-hidden bg-white shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                                                    <th className="py-3.5 px-5 text-[12px] font-medium text-gray-500 w-[50px]">Estado</th>
                                                    <th className="py-3.5 px-5 text-[12px] font-medium text-gray-500">Nombre</th>
                                                    <th className="py-3.5 px-5 text-[12px] font-medium text-gray-500">Correo</th>
                                                    <th className="py-3.5 px-5 text-[12px] font-medium text-gray-500">Rol</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...systemUsers].sort((a, b) => (a.id === currentUser?.id ? -1 : (b.id === currentUser?.id ? 1 : 0))).map((u, i) => {
                                                    const isMe = u.id === currentUser?.id;
                                                    return (
                                                    <tr key={i} className={`border-b border-gray-100 last:border-b-0 transition-colors ${isMe ? 'bg-indigo-50/50' : 'hover:bg-gray-50/50'}`}>
                                                        <td className="py-4 px-5">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${onlineUsers.includes(u.id) ? 'bg-[#10B981]' : 'bg-gray-300'}`}></div>
                                                                <span className="text-[12px] font-medium text-gray-500">
                                                                    {onlineUsers.includes(u.id) ? 'Activo' : 'Inactivo'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-medium text-gray-600 overflow-hidden border border-gray-200">
                                                                    {u.photo ? <img src={u.photo} className="w-full h-full object-cover" /> : u.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-[14px] font-medium text-gray-900">
                                                                    {u.name} {isMe && <span className="text-[12px] text-[#8B5CF6] font-medium ml-1">(Tú)</span>}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-5 text-[14px] text-gray-500">
                                                            {isMe ? u.email : ''}
                                                        </td>
                                                        <td className="py-4 px-5">
                                                            <RoleBadge role={u.role} />
                                                        </td>
                                                        
                                                    </tr>
                                                )})}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Actions */}
                    {(activeHighlight === 'Mi Cuenta') && (
                        <div className="px-10 py-5 border-t border-gray-200 flex justify-end gap-3 bg-white mt-auto">
                             <button 
                                onClick={handleCancelEdit}
                                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[14px] font-medium rounded-lg transition-colors shadow-sm"
                             >
                                 Cancelar
                             </button>
                             <button 
                                onClick={handleSaveProfile} 
                                className="px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[14px] font-medium rounded-lg transition-colors min-w-[100px] shadow-sm flex items-center justify-center"
                             >
                                 {isSaving ? (
                                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                 ) : 'Guardar'}
                             </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ENTERPRISE LOGOUT POP-UP MODAL WINDOW */}
            {showLogoutModal && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/15 animate-in fade-in duration-200"
                    onClick={() => !isLoggingOut && setShowLogoutModal(false)}
                >
                    <div 
                        className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-9 text-center flex flex-col items-center animate-in zoom-in-95 duration-200 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button X */}
                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(false)}
                            disabled={isLoggingOut}
                            className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
                        >
                            <X size={18} />
                        </button>

                        {/* Top Logout Spot Illustration */}
                        <div className="mt-1 mb-3 flex items-center justify-center">
                            <LogoutSpotIllustration />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
                            ¿Cerrar sesión?
                        </h3>

                        {/* Subtitle */}
                        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-7 max-w-[300px]">
                            Tu sesión activa en la plataforma corporativa finalizará de forma segura.
                        </p>

                        {/* Action Buttons: CANCELAR & CONFIRMAR */}
                        <div className="flex items-center justify-center gap-3 w-full max-w-[320px]">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                disabled={isLoggingOut}
                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all border border-slate-200/80 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    setIsLoggingOut(true);
                                    try {
                                        await supabase.auth.signOut();
                                    } catch (e) {
                                        console.error(e);
                                    } finally {
                                        setIsLoggingOut(false);
                                        setShowLogoutModal(false);
                                    }
                                }}
                                disabled={isLoggingOut}
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoggingOut ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <span>Confirmar</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/15 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                                <Trash2 size={20} />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                                <h3 className="text-base font-bold text-gray-900">¿Eliminar usuario?</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Estás a punto de eliminar permanentemente a <span className="font-semibold text-gray-900">{userToDelete.name}</span> ({userToDelete.email}). Esta acción no se puede deshacer.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setUserToDelete(null)}
                                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteUser}
                                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-red-600/10"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Alert Message Modal */}
            {alertMessage && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/15 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                                <Info size={20} />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                                <h3 className="text-base font-bold text-gray-900">Acción no permitida</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {alertMessage}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setAlertMessage(null)}
                                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-850 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Crop Modal */}
            {cropModalOpen && (
                <div className="fixed inset-0 z-[9999] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-base font-bold text-gray-900">Ajustar Foto</h3>
                            <button onClick={() => setCropModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative w-full h-[300px] bg-slate-50">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button
                                onClick={() => setCropModalOpen(false)}
                                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCropSave}
                                className="px-4 py-2 bg-[#488fcc] hover:bg-[#3d7ab0] text-white text-xs font-bold rounded-xl transition-all shadow-md"
                            >
                                Recortar y Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- MAIN LAYOUT ---
const SidebarItem = ({ icon, label, id, active, onClick, index }: any) => (
    <button 
        id={`tour-nav-${id}`}
        onClick={() => onClick(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 animate-stagger-left ${
            active 
            ? 'bg-[#203e71] text-white font-semibold shadow-sm shadow-blue-950/15' 
            : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-900'
        }`}
        style={{ animationDelay: `${100 + index * 50}ms` }}
    >
        {React.cloneElement(icon, { size: 20, className: active ? 'text-[#488fcc]' : 'text-gray-400' })}
        <span>{label}</span>
    </button>
);

const playSuccessSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;
        const playNote = (freq: number, start: number, duration: number, vol: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(vol, start + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration);
        };
        // Ultra-elegant system entry audio chime
        playNote(523.25, now, 0.5, 0.08);         // C5
        playNote(659.25, now + 0.08, 0.5, 0.08);    // E5
        playNote(783.99, now + 0.16, 0.6, 0.07);    // G5
        playNote(1046.50, now + 0.24, 0.8, 0.05);   // C6
    } catch (error) {
        console.error("No se pudo reproducir el sonido de éxito:", error);
    }
};

const AppLayout = () => {
    const { 
        currentView, navigateTo, profile, setProfile, business, user, loading, 
        toast, setToast, showUnsavedModal, handleSaveAndNavigate, 
        handleDiscardAndNavigate, handleCancelNavigation, isSavingUnsaved 
    } = useContext(AppContext);
    const [isInviteFlow, setIsInviteFlow] = useState(() => window.location.hash.includes('type=invite') || window.location.search.includes('type=invite'));
    const [isRecoveryFlow, setIsRecoveryFlow] = useState(() => {
        const href = window.location.href;
        return href.includes('type=recovery') || href.includes('mode=recovery') || href.includes('reset_token');
    });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [onboardingPhase, setOnboardingPhase] = useState<'robot' | 'tour' | 'done'>('robot');
    const [tourStepIndex, setTourStepIndex] = useState(0);
    const [pendingTourStep, setPendingTourStep] = useState<number | null>(null);

    // Tour Steps for guided onboarding
    const tourSteps = [
        {
            target: '#tour-nav-dashboard',
            content: '¡Hola! Soy Bluebot y te daré un recorrido súper genial y claro. Empezamos en el Dashboard: tu panel de control central donde verás el pulso y las estadísticas clave de tu negocio. ¡Vamos a explorar cada parte!',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'right' as const,
            title: '🚀 ¡Bienvenido a tu Centro de Control!'
        },
        {
            target: '#tour-stat-sales',
            content: 'Muestra la suma mensual de todos los servicios activos contratados por tus clientes. Se calcula de forma automática para reflejar tus ingresos comerciales reales.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'bottom' as const,
            title: '💰 Total Ventas (Ingresos Activos)'
        },
        {
            target: '#tour-stat-clients',
            content: 'Indica cuántos clientes activos tienes actualmente en tu cartera. Te ayuda a monitorear el volumen de cuentas activas en la plataforma.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'bottom' as const,
            title: '👥 Clientes Activos en Cartera'
        },
        {
            target: '#tour-stat-tasks',
            content: 'Muestra el porcentaje de avance y el total de tareas finalizadas. ¡Es tu indicador perfecto para medir la productividad del equipo!',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'bottom' as const,
            title: '✅ Avance de Tareas'
        },
        {
            target: '#tour-stat-products',
            content: 'Aquí ves las soluciones o productos disponibles en tu catálogo. Puedes hacer clic en "Gestionar Servicios" para agregar nuevos paquetes.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'bottom' as const,
            title: '📦 Portafolio de Servicios'
        },
        {
            target: '#tour-chart-flow',
            content: 'Esta gráfica de barras compara visualmente los ingresos facturados por cliente. Al pasar el cursor verás los montos exactos para identificar a tus clientes principales.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'top' as const,
            title: '📊 Flujo Financiero por Cliente'
        },
        {
            target: '#tour-chart-pie',
            content: 'Un gráfico circular que desglosa qué porcentaje de tus ingresos proviene de cada servicio. ¡Así descubres al instante cuál es tu servicio más vendido!',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'top' as const,
            title: '🍰 Distribución de Servicios'
        },
        {
            target: '#tour-recent-clients',
            content: 'Acceso directo a los últimos clientes dados de alta con su empresa y servicios vinculados.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'top' as const,
            title: '📋 Clientes Recientes'
        },
        {
            target: '#tour-team-members',
            content: 'Lista de los colaboradores de tu equipo, su rol y un indicador verde en vivo cuando están conectados en el sistema.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'top' as const,
            title: '👥 Tu Equipo de Trabajo'
        },
        {
            target: '#tour-nav-clients',
            content: '¡Siguiente parada! La sección de Clientes. Aquí es donde gestionas todos los expedientes digitales y la información de contacto.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'right' as const,
            title: '📇 Sección de Clientes'
        },
        {
            target: '#tour-clients-header',
            content: 'Arriba tienes un buscador inteligente. Escribe cualquier nombre de cliente o empresa para encontrarlo en milisegundos.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'bottom' as const,
            title: '🔍 Buscador de Expedientes'
        },
        {
            target: '#tour-clients-add-btn',
            content: '¡Práctica fácil! Haz clic en este botón para registrar un nuevo cliente. Podrás ingresar su nombre, empresa, email, teléfono y asociarle sus servicios contratados.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'left' as const,
            title: '➕ Práctica: Crear un Nuevo Cliente'
        },
        {
            target: '#tour-clients-grid',
            content: 'Cada cliente tiene su tarjeta interactiva. Al hacer clic abres su expediente con tareas, notas, documentos y opción de editar o eliminar.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'top' as const,
            title: '📇 Fichas y Gestión de Clientes'
        },
        {
            target: '#tour-nav-tasks_global',
            content: '¡Cambiemos de vista! Te presento el Tablero de Tareas. Aquí coordinas los pendientes de todos tus clientes en un solo lugar.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'right' as const,
            title: '📋 Tablero Global de Tareas'
        },
        {
            target: '#tour-tasks-filters',
            content: 'Filtra tus tareas rápidamente por estado ("Pendientes" / "Finalizadas") o nivel de prioridad ("Alta", "Media", "Baja") para resolver primero lo más urgente.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'bottom' as const,
            title: '🎯 Filtros Rápidos de Tareas'
        },
        {
            target: '#tour-tasks-add-btn',
            content: '¡Práctica de creación! Con este botón creas una tarea, la asignas a un colaborador, fijas fecha de vencimiento y la asocias a un cliente.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'left' as const,
            title: '➕ Práctica: Crear Nueva Tarea'
        },
        {
            target: '#tour-nav-products',
            content: '¡Vamos al catálogo! En Servicios configuras los productos que ofrece tu negocio y sus precios base.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'right' as const,
            title: '📦 Catálogo de Servicios'
        },
        {
            target: '#tour-products-add-btn',
            content: '¡Práctica de creación! Al pulsar aquí agregas un nuevo servicio con su nombre, descripción, precio y porcentaje de comisión.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'left' as const,
            title: '➕ Práctica: Crear Servicio'
        },
        {
            target: '#tour-nav-settings',
            content: 'Por último, en Configuración puedes personalizar tu perfil, el logo de tu empresa, el nombre del ERP, la moneda y administrar el equipo.',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'right' as const,
            title: '⚙️ Configuración y Miembros'
        },
        {
            target: '#tour-nav-dashboard',
            content: '¡Felicidades! Has completado el recorrido guiado. Ahora conoces al 100% cada rincón de BLUENET. ¡Éxito gestionando tu negocio!',
            disableBeacon: true,
            skipBeacon: true,
            placement: 'right' as const,
            title: '🎉 ¡Tour Completado con Éxito!'
        }
    ];

    const handleSkipAllOnboarding = async () => {
        setOnboardingPhase('done');
        setProfile((prev: any) => ({ ...prev, ha_visto_tutorial: true }));
        if (user) {
            localStorage.setItem(`visto_tutorial_${user.id}`, 'true');
            try {
                await supabase.from('profiles').update({ ha_visto_tutorial: true }).eq('id', user.id);
            } catch (err) {
                console.error("Error updating tutorial status:", err);
            }
        }
    };

    const getRequiredViewForStep = (step: number): string => {
        if (step >= 0 && step <= 8) return 'dashboard';
        if (step >= 9 && step <= 12) return 'clients';
        if (step >= 13 && step <= 15) return 'tasks_global';
        if (step >= 16 && step <= 17) return 'products';
        if (step === 18) return 'settings';
        return 'dashboard';
    };

    useEffect(() => {
        if (pendingTourStep === null || onboardingPhase !== 'tour') return;

        const targetSelector = tourSteps[pendingTourStep]?.target;
        if (!targetSelector) {
            setPendingTourStep(null);
            return;
        }

        const requiredView = getRequiredViewForStep(pendingTourStep);

        if (currentView !== requiredView) {
            navigateTo(requiredView);
        }

        let intervalId: any;
        let attempts = 0;

        const checkAndAdvance = () => {
            attempts++;
            const el = document.querySelector(targetSelector);
            if (el) {
                setTourStepIndex(pendingTourStep);
                setPendingTourStep(null);
                if (intervalId) clearInterval(intervalId);
            } else if (attempts > 30) {
                setTourStepIndex(pendingTourStep);
                setPendingTourStep(null);
                if (intervalId) clearInterval(intervalId);
            }
        };

        checkAndAdvance();
        intervalId = setInterval(checkAndAdvance, 40);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [pendingTourStep, currentView, onboardingPhase]);

    const handleStartJoyrideTour = () => {
        navigateTo('dashboard');
        setTourStepIndex(0);
        setPendingTourStep(0);
        setOnboardingPhase('tour');
    };

    const handleJoyrideCallback = async (data: any) => {
        const { action, index, status, type } = data;
        
        if (status === 'finished' || status === 'skipped' || action === 'close') {
            setOnboardingPhase('done');
            setPendingTourStep(null);
            setProfile((prev: any) => ({ ...prev, ha_visto_tutorial: true }));
            if (user) {
                localStorage.setItem(`visto_tutorial_${user.id}`, 'true');
                try {
                    await supabase.from('profiles').update({ ha_visto_tutorial: true }).eq('id', user.id);
                } catch (err) {
                    console.error("Error updating tutorial status:", err);
                }
            }
            return;
        }

        if (type === 'step:after') {
            const nextStep = action === 'prev' ? index - 1 : index + 1;
            if (nextStep >= 0 && nextStep < tourSteps.length) {
                const requiredViewForNext = getRequiredViewForStep(nextStep);
                if (currentView !== requiredViewForNext) {
                    // Transición entre secciones: cambiamos la vista y ponemos el paso pendiente
                    navigateTo(requiredViewForNext);
                    setPendingTourStep(nextStep);
                } else {
                    // Misma sección: actualizamos el paso de manera inmediata y síncrona
                    setTourStepIndex(nextStep);
                }
            }
        } else if (type === 'target:not_found') {
            if (index >= 0 && index < tourSteps.length) {
                const requiredViewForStep = getRequiredViewForStep(index);
                if (currentView !== requiredViewForStep) {
                    navigateTo(requiredViewForStep);
                }
                setPendingTourStep(index);
            }
        }
    };

    // Intro loading state synchronized with actual data readiness
    const [introLoading, setIntroLoading] = useState(true);

    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const confirmDeleteUser = async () => {
        // Implementation logic for deleting user
    };

    useEffect(() => {
        if (!user || isInviteFlow || isRecoveryFlow) {
            setIntroLoading(true);
            return;
        }

        if (!loading) {
            const timer = setTimeout(() => {
                setIntroLoading(false);
            }, 250);
            return () => clearTimeout(timer);
        } else {
            setIntroLoading(true);
        }
    }, [user, loading, isInviteFlow, isRecoveryFlow]);

    // Fast check for session lookup (while user is null and loading is true)
    if (loading && !user) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans select-none antialiased relative overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center -mt-20"
                >
                    <img 
                        src="https://i.imgur.com/4Wc522w.png" 
                        alt="BLUENET" 
                        className="h-24 sm:h-28 md:h-32 w-auto object-contain mb-8"
                        referrerPolicy="no-referrer"
                    />
                    <div className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 animate-spin text-[#203e71]" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-xs font-medium text-slate-500 tracking-wide">
                            Cargando...
                        </span>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!user || isInviteFlow || isRecoveryFlow) {
        return <Login onAuthSuccess={() => {
            navigateTo('dashboard');
            setIsInviteFlow(false);
            setIsRecoveryFlow(false);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }} isInviteFlow={isInviteFlow} isRecoveryFlow={isRecoveryFlow} inviteUser={user} />;
    }

    if (introLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans select-none antialiased relative overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex flex-col items-center -mt-24"
                >
                    <div className="relative mb-10 flex items-center justify-center">
                        <img 
                            src="https://i.imgur.com/4Wc522w.png" 
                            alt="BLUENET" 
                            className="h-28 sm:h-32 md:h-36 w-auto object-contain"
                            referrerPolicy="no-referrer"
                        />
                    </div>

                    <div className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 animate-spin text-[#203e71]" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-xs font-medium text-slate-500 tracking-wide">
                            Cargando...
                        </span>
                    </div>
                </motion.div>
            </div>
        );
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
        { id: 'clients', label: 'Clientes', icon: <Users /> },
        { id: 'tasks_global', label: 'Tareas', icon: <CheckSquare /> },
        { id: 'products', label: 'Servicios', icon: <Package /> },
        { id: 'commissions', label: 'Comisiones', icon: <DollarSign /> },
        { id: 'settings', label: 'Configuración', icon: <Settings /> },
    ];

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardView />;
            case 'clients': return <ClientsListView />;
            case 'clientProfile': return <ClientProfileView />;
            case 'tasks_global': return <GlobalTasksView />;
            case 'products': return <ProductsView />;
            case 'commissions': return <CommissionsView />;
            case 'settings': return <SettingsView />;
            default: return <DashboardView />;
        }
    };

    // Temp mode: Always show onboarding welcome screen and tour until requested otherwise
    const needsOnboarding = !introLoading && !loading && user && !isInviteFlow && !isRecoveryFlow;
    const showRobotWelcome = needsOnboarding && onboardingPhase === 'robot';
    const runJoyrideTour = needsOnboarding && onboardingPhase === 'tour';
    const JoyrideComponent = Joyride as any;

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans text-gray-900 overflow-hidden">
            <OnboardingRobot 
                isOpen={showRobotWelcome}
                onStartTour={handleStartJoyrideTour}
                onSkipAll={handleSkipAllOnboarding}
            />
            <JoyrideComponent
                steps={tourSteps}
                run={runJoyrideTour}
                stepIndex={tourStepIndex}
                continuous={true}
                showSkipButton={true}
                showProgress={true}
                disableBeacon={true}
                skipBeacon={true}
                spotlightClicks={false}
                disableOverlayClose={true}
                spotLightPadding={8}
                floaterProps={{ disableAnimation: true }}
                locale={{
                    back: 'Anterior',
                    close: 'Cerrar',
                    last: '¡Finalizar! 🎉',
                    next: 'Siguiente ➔',
                    open: 'Abrir',
                    skip: 'Omitir Tour'
                }}
                callback={handleJoyrideCallback}
                styles={{
                    options: {
                        arrowColor: '#ffffff',
                        backgroundColor: '#ffffff',
                        overlayColor: 'rgba(15, 23, 42, 0.55)',
                        primaryColor: '#00a2e8',
                        textColor: '#334155',
                        zIndex: 10000,
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                        borderRadius: '20px',
                        padding: '18px',
                        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
                    },
                    buttonNext: {
                        backgroundColor: '#00a2e8',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        padding: '9px 20px',
                        outline: 'none',
                        boxShadow: '0 4px 14px rgba(0, 162, 232, 0.4)',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                    },
                    buttonBack: {
                        color: '#64748b',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginRight: '12px',
                        cursor: 'pointer'
                    },
                    buttonSkip: {
                        color: '#94a3b8',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    },
                    title: {
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '8px'
                    }
                } as any}
            />
            <GlobalStyles />
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col z-10 shadow-sm relative">
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-start px-5 border-b border-gray-100 animate-stagger-left" style={{ animationDelay: '0ms' }}>
                    <img 
                        src="https://i.imgur.com/zPCOgFI.png" 
                        alt="Logo" 
                        className="max-h-9 w-auto object-contain block"
                        referrerPolicy="no-referrer"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item, index) => (
                        <SidebarItem 
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            icon={item.icon}
                            index={index}
                            active={currentView === item.id || (item.id === 'clients' && currentView === 'clientProfile')}
                            onClick={(id: string) => navigateTo(id)}
                        />
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-50 animate-stagger-left" style={{ animationDelay: `${100 + navItems.length * 50}ms` }}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigateTo('settings')}>
                        {profile.photo ? (
                            <img 
                                src={profile.photo} 
                                alt="User" 
                                className="w-10 h-10 rounded-full border border-gray-200 object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#488fcc]/10 border border-gray-150 text-[#203e71] font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{profile.name}</p>
                            <div className="mt-0.5">
                                <RoleBadge role={profile.role} size="sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top System Header Bar */}
                <header className="w-full h-12 sm:h-14 bg-white border-b border-gray-100 overflow-hidden relative shrink-0">
                    <img 
                        src="https://i.imgur.com/YNGWEWc.png" 
                        alt="Header Banner" 
                        className="w-full h-full object-cover object-left-top block"
                        referrerPolicy="no-referrer"
                    />
                </header>

                {/* Scrollable View Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full flex flex-col">
                    <div className="w-full flex-1">
                        {renderView()}
                    </div>
                </div>
            </main>

            {/* Global Toast Notification */}
            <GlobalToast toast={toast} onClose={() => setToast(null)} />

            {/* Unsaved Changes Protection Modal */}
            <UnsavedChangesModal 
                isOpen={showUnsavedModal} 
                onSave={handleSaveAndNavigate} 
                onDiscard={handleDiscardAndNavigate} 
                onCancel={handleCancelNavigation} 
                isSaving={isSavingUnsaved} 
            />
        </div>
    );
};

export default function App() {
    return (
        <AppProvider>
            <AppLayout />
        </AppProvider>
    );
}
