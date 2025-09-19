export interface ClientBilling {
    id: string;
    clientId: string;
    companyName: string;
    companyLogo: string;
    subscriptionPlan: string;
    planType: 'Business' | 'Enterprise' | 'Professional' | 'Starter';
    billingCycle: string;
    renewsDate: string;
    status: 'Active' | 'Suspended' | 'Trial' | 'Expired' | 'Pending';
    paymentMethod?: string;
}