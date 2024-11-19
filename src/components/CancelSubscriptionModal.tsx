import React from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentPeriodEnd: string;
}

function CancelSubscriptionModal({ isOpen, onClose, onConfirm, currentPeriodEnd }: CancelSubscriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Annuler l'abonnement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-gray-300">
            Êtes-vous sûr de vouloir annuler votre abonnement Premium ?
          </p>

          <div className="bg-gray-700/50 p-3 rounded-lg space-y-2">
            <p className="text-sm text-gray-300">
              En annulant maintenant :
            </p>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>Votre abonnement restera actif jusqu'au {format(new Date(currentPeriodEnd), 'dd MMMM yyyy', { locale: fr })}</li>
              <li>Vous conservez l'accès à toutes les fonctionnalités Premium jusqu'à cette date</li>
              <li>Aucun remboursement ne sera effectué pour la période en cours</li>
              <li>Vous pouvez réactiver votre abonnement à tout moment avant la date d'expiration</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelSubscriptionModal;