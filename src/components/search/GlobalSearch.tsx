import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { searchClients } from '../../services/api'; // fonction à implémenter côté API
import { CreateTicketModal } from '../incidents/CreateTicketModal';
import type { Client } from '../../types';

export const GlobalSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Client[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setTimeout(() => setShowResults(false), 100);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setResults([]);
            return;
        }
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = window.setTimeout(async () => {
            try {
                const res = await searchClients(searchQuery.trim().toLowerCase());
                setResults(res);
                setShowResults(true);
            } catch (error) {
                console.error("❌ Erreur de recherche :", error);
            }
        }, 300);
    }, [searchQuery]);

    const handleCreateTicket = (client: Client) => {
        setSelectedClient(client);
        setShowCreateModal(true);
    };

    return (
        <div id="global-search-box" className="relative w-full" ref={searchContainerRef}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Rechercher un client..."
                className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-full text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                    if (results.length > 0) setShowResults(true);
                }}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700 max-h-96 overflow-y-auto z-50">
                    {results.map((client) => (
                        <div
                            key={client.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg cursor-pointer group"
                            onClick={() => setShowResults(false)}
                        >
                            <div>
                                <p className="font-medium text-gray-100">{client.name}</p>
                                <p className="text-sm text-gray-400">
                                    {client.company ? client.company.name : "Société inconnue"}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCreateTicket(client);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-600 rounded-lg"
                                title="Créer un ticket"
                            >
                                <Plus className="h-5 w-5 text-blue-400" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {showCreateModal && selectedClient && (
                <CreateTicketModal
                    initialClient={selectedClient}
                    onClose={() => {
                        setShowCreateModal(false);
                        setSelectedClient(null);
                    }}
                    onSubmit={(newTicket) => {
                        console.log('Nouveau ticket:', newTicket);
                        setShowCreateModal(false);
                        setSelectedClient(null);
                    }}
                />
            )}
        </div>
    );
};
