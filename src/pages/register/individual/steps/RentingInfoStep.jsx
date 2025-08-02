import React from "react";
import { useTranslation } from "react-i18next";

const RentingInfoStep = ({
  dailyPrice,
  weeklyPrice,
  monthlyPrice,
  minRentalDays,
  depositAmount,
  cancellationPolicy,
  updateFields
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        {t('registration.rentingInformation')}
      </h2>
      
      {/* Daily Price */}
      <div>
        <label htmlFor="dailyPrice" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.dailyPrice')} {t('registration.required')}
        </label>
        <input
          id="dailyPrice"
          name="dailyPrice"
          placeholder={t('registration.dailyPricePlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="0"
          step="0.01"
          value={dailyPrice}
          onChange={e => updateFields({dailyPrice: e.target.value})}
          required
        />
      </div>

      {/* Weekly Price */}
      <div>
        <label htmlFor="weeklyPrice" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.weeklyPrice')}
        </label>
        <input
          id="weeklyPrice"
          name="weeklyPrice"
          placeholder={t('registration.weeklyPricePlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="0"
          step="0.01"
          value={weeklyPrice}
          onChange={e => updateFields({weeklyPrice: e.target.value})}
        />
      </div>

      {/* Monthly Price */}
      <div>
        <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.monthlyPrice')}
        </label>
        <input
          id="monthlyPrice"
          name="monthlyPrice"
          placeholder={t('registration.monthlyPricePlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="0"
          step="0.01"
          value={monthlyPrice}
          onChange={e => updateFields({monthlyPrice: e.target.value})}
        />
      </div>

      {/* Minimum Rental Days */}
      <div>
        <label htmlFor="minRentalDays" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.minRentalDays')} {t('registration.required')}
        </label>
        <input
          id="minRentalDays"
          name="minRentalDays"
          placeholder={t('registration.minRentalDaysPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="1"
          value={minRentalDays}
          onChange={e => updateFields({minRentalDays: e.target.value})}
          required
        />
      </div>

      {/* Deposit Amount */}
      <div>
        <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.depositAmount')} {t('registration.required')}
        </label>
        <input
          id="depositAmount"
          name="depositAmount"
          placeholder={t('registration.depositAmountPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="0"
          step="0.01"
          value={depositAmount}
          onChange={e => updateFields({depositAmount: e.target.value})}
          required
        />
      </div>

      {/* Cancellation Policy */}
      <div>
        <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.cancellationPolicy')} {t('registration.required')}
        </label>
        <select
          id="cancellationPolicy"
          name="cancellationPolicy"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={cancellationPolicy}
          onChange={e => updateFields({cancellationPolicy: e.target.value})}
          required
        >
          <option value="">{t('registration.selectCancellationPolicy')}</option>
          <option value="Flexible">{t('registration.flexible')}</option>
          <option value="Moderate">{t('registration.moderate')}</option>
          <option value="Strict">{t('registration.strict')}</option>
          <option value="Non-refundable">{t('registration.nonRefundable')}</option>
        </select>
      </div>
    </div>
  );
};

export default RentingInfoStep;
