import { ArrowRight, CloudRain, Wind } from 'lucide-react'
import Link from 'next/link'

interface PremiumCardProps {
    title?: string
    description?: string
    buttonText?: string
    href?: string
}

export default function PremiumCard({
    title = "Passez au niveau supérieur",
    description = "Optimisez vos chantiers avec notre module d'analyse prédictive. Anticipez les retards météo et les coûts.",
    buttonText = "Découvrir les outils Premium",
    href = "/premium"
}: PremiumCardProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#022c22] to-black p-8 md:p-10 text-white shadow-2xl animate-fade-in group">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

                <div className="max-w-md space-y-6 text-center md:text-left">
                    <h3 className="text-3xl font-bold tracking-tight text-white leading-tight">
                        {title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        {description}
                    </p>

                    <Link href={href}>
                        <button className="inline-flex items-center gap-2 bg-white text-[#022c22] px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg shadow-green-900/20">
                            {buttonText}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {/* Visual Element: System Status Card */}
                <div className="relative transform md:rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-[280px] shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold tracking-widest uppercase text-green-400">System Status</span>
                            </div>
                        </div>

                        <div className="mb-2">
                            <span className="text-5xl font-bold text-white">98%</span>
                        </div>
                        <div className="text-sm text-gray-400 font-medium mb-6">
                            Efficacité Opérationnelle
                        </div>

                        <div className="border-t border-white/10 pt-4 flex gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-1.5 text-xs text-gray-300 mb-1">
                                    <CloudRain className="w-3 h-3" />
                                    <span>Pluie</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-[20%]"></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-1.5 text-xs text-gray-300 mb-1">
                                    <Wind className="w-3 h-3" />
                                    <span>Vent</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-400 w-[10%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements behind card */}
                    <div className="absolute -z-10 bg-green-500/20 rounded-2xl inset-0 blur-xl transform translate-y-4 translate-x-4"></div>
                </div>
            </div>
        </div>
    )
}
