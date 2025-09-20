import { z } from "zod"

export const formSchema = z.object({
  // Step 1 - Create Account
  clientName: z.string().min(1, "Client name is required"),
  email: z.string().email("Please enter a valid email address"),
  contactPersonName: z.string().min(1, "Contact person name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  isReferred: z.boolean(),
  referrerName: z.string().optional(),
  referrerEmail: z.string().email().optional().or(z.literal("")),
  referrerPhone: z.string().optional(),
  howDidClientHear: z.string().optional(),

  // Step 2 - Branding & Layout
  clientLogo: z.any().optional(),
  favicon: z.any().optional(),
  primaryBrandColor: z.string().min(1, "Primary brand color is required"),
  secondaryBrandColor: z.string().min(1, "Secondary brand color is required"),
  showFooterInViewer: z.boolean(),
  customFooterText: z.string(),
  supportContactLink: z.string(),

  // Step 3 - Add Instance
  subdomain: z.string().min(1, "Subdomain is required"),
  regionServerLocation: z.string().min(1, "Region/Server location is required"),
  timeZone: z.string().min(1, "Time zone is required"),
  defaultLanguage: z.string().min(1, "Default language is required"),
  enableOnboardingGuide: z.boolean(),
  autoGenerateWelcomeDashboard: z.boolean(),
  industryTemplate: z.string().min(1, "Industry template is required"),

  // Step 4 - Test Library
  enableCustomChartLibrary: z.boolean(),
  notifyDevQATeam: z.boolean(),
  selectedTeamMember: z.string().optional(),

  // Step 5 - Storage & Subscription
  storageQuota: z.string().min(1, "Storage quota is required"),
  archiveAfter: z.string(),
  enableUsageWarningAlerts: z.boolean(),
  autoArchiveThreshold: z.string().optional(),
  billingCycle: z.string().min(1, "Billing cycle is required"),
  subscriptionPlan: z.string().min(1, "Subscription plan is required"), // Made subscription plan required
  startBillingDate: z.string().optional(),
  paymentMethod: z.string().min(1, "Payment method is required"), // Made payment method required
  discountPromotion: z.string().optional(),
  trialPeriod: z.string(),
  internalNotesEnabled: z.boolean(),
  adminNote: z.string().optional(),
})

export type FormData = z.infer<typeof formSchema>
