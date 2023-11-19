import Consent from "../model/consentModel.js";
import VendorConsentModel from "../model/vendorConsentModel.js";

export const createClientConsent = async (
  clientId,
  acceptTermsAndConditions,
  session,
) => {
  const consentData = {
    client: clientId,
    acceptTermsAndConditions,
    lastUpdated: Date.now(),
  };
  const create = await Consent.create([consentData], session);
  return create[0];
};

export const updateConsent = async (clientId, updateData) => {
  const updatedConsent = await Consent.findOneAndUpdate(
    { client: clientId },
    {
      receivePersonalisedRecommendations:
        updateData.receivePersonalisedRecommendations,
      receiveAdminNewsletters: updateData.receiveAdminNewsletters,
      lastUpdated: Date.now(),
    },
    {
      new: true,
    },
  );

  return updatedConsent;
};

export const getClientConsent = async (clientId) => {
  const clientConsent = await Consent.findOne({ client: clientId });
  return clientConsent;
};

export const createVendorConsent = async (
  vendorId,
  acceptTermsAndConditions,
  session,
) => {
  const consentData = {
    vendor: vendorId,
    acceptTermsAndConditions,
    lastUpdated: Date.now(),
  };
  const create = await VendorConsentModel.create([consentData], session);
  return create[0];
};

export const getVendorConsent = async (vendorId) => {
  const vendorConsent = await VendorConsentModel.findOne({ vendor: vendorId });
  return vendorConsent;
};
