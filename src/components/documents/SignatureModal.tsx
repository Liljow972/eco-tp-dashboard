'use client';

import { useState } from 'react';
import { X, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SignatureModalProps {
    document: {
        id: string;
        name: string;
        url: string;
    };
    onClose: () => void;
    onSuccess: () => void;
}

export default function SignatureModal({ document, onClose, onSuccess }: SignatureModalProps) {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState('');

    const handleSign = async () => {
        if (!fullName.trim() || !isChecked) {
            setError('Veuillez remplir votre nom et cocher la case de certification.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // 1. Mise à jour en base de données
            const { error: updateError } = await supabase
                .from('documents')
                .update({
                    is_signed: true,
                    signed_at: new Date().toISOString(),
                    signed_by_name: fullName,
                    signature_metadata: {
                        ip: 'client-ip-placeholder', // Idéalement via Edge Function
                        user_agent: navigator.userAgent,
                        consent_text: "Je certifie sur l’honneur signer ce document en mon nom et avoir pris connaissance de l’exactitude de son contenu."
                    }
                })
                .eq('id', document.id);

            if (updateError) throw updateError;

            // 2. Notification de succès
            // (Optionnel : Envoyer un email ou une notif à l'admin)

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erreur signature:', err);
            setError('Une erreur est survenue lors de la signature. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-ecotp-green-600" />
                            Signature Électronique
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Document : {document.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col md:flex-row gap-6">

                    {/* Preview Document */}
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px] flex items-center justify-center relative overflow-hidden">
                        {document.url ? (
                            document.url.endsWith('.pdf') ? (
                                <iframe
                                    src={`${document.url}#toolbar=0&navpanes=0`}
                                    className="w-full h-full absolute inset-0"
                                    title="Document Preview"
                                    onError={() => {
                                        console.error('Erreur chargement PDF:', document.url);
                                    }}
                                />
                            ) : (
                                <div className="text-center p-8">
                                    <img
                                        src={document.url}
                                        alt="Aperçu"
                                        className="max-w-full max-h-[400px] object-contain mx-auto rounded shadow-sm"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            console.error('Erreur chargement image:', document.url);
                                        }}
                                    />
                                    <p className="mt-4 text-sm text-gray-500">
                                        Aperçu du document. Veuillez le télécharger pour une lecture complète si nécessaire.
                                    </p>
                                    <a
                                        href={document.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 inline-block text-ecotp-green-600 hover:text-ecotp-green-700 underline text-sm"
                                    >
                                        Ouvrir dans un nouvel onglet
                                    </a>
                                </div>
                            )
                        ) : (
                            <div className="text-center p-8">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">Aperçu non disponible</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Le document sera disponible après signature.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Signature Form */}
                    <div className="w-full md:w-80 shrink-0 space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                            <p className="font-semibold mb-1">Information</p>
                            Veuillez lire attentivement le document avant de procéder à la signature.
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom complet du signataire <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Ex: Jean Dupont"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ecotp-green-500 focus:border-ecotp-green-500 transition-all outline-none"
                            />
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-ecotp-green-600 checked:bg-ecotp-green-600 hover:border-ecotp-green-500"
                                    />
                                    <CheckCircle className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-tight">
                                    Je certifie sur l’honneur signer ce document en mon nom et avoir pris connaissance de l’exactitude de son contenu.
                                </span>
                            </label>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg animate-shake">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        disabled={loading}
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSign}
                        disabled={loading || !isChecked || !fullName.trim()}
                        className="px-8 py-2.5 bg-ecotp-green-600 text-white rounded-xl hover:bg-ecotp-green-700 transition-all shadow-lg shadow-ecotp-green-900/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        {loading ? 'Signature...' : 'Signer le document'}
                    </button>
                </div>
            </div>
        </div>
    );
}
