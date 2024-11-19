import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, CreditCard, AlertTriangle } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CancelSubscriptionModal from './CancelSubscriptionModal';

function SubscriptionCard() {
  const { t } = useTranslation();
  const { subscription, cancelSubscription, reactivateSubscription } = useSubscriptionStore();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = () => {
    cancelSubscription();
    setShowCancelModal(false);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold">{t('settings.subscription.title')}</h2>
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-red-500">Premium</h3>
                <p className="text-sm text-gray-400">Plan actuel</p>
              </div>
              <span className="text-lg font-bold">14.99€<span className="text-sm font-normal text-gray-400">/mois</span></span>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Accès illimité à toutes les fonctionnalités</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Support prioritaire</span>
              </div>
            </div>
          </div>
          
          {subscription.cancelAtPeriodEnd && (
            <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-500 font-medium">Abonnement annulé</p>
                  <p className="text-sm text-gray-400">
                    Votre accès Premium sera maintenu jusqu'au {format(new Date(subscription.currentPeriodEnd), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                  <button
                    onClick={reactivateSubscription}
                    className="mt-2 text-sm text-yellow-500 hover:text-yellow-400 font-medium"
                  >
                    Réactiver l'abonnement
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Prochain paiement</span>
              <span>{format(new Date(subscription.currentPeriodEnd), 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Méthode de paiement</span>
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> •••• {subscription.paymentMethod.last4}
              </span>
            </div>
          </div>

          {!subscription.cancelAtPeriodEnd && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="mt-4 w-full py-2 px-4 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Annuler l'abonnement
            </button>
          )}
        </div>
      </div>

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        currentPeriodEnd={subscription.currentPeriodEnd}
      />
    </>
  );
}

export default SubscriptionCard;