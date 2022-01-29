import { createUrl } from '../base-url';

export const AdminDashboardAnalyticsUrls = {
    getDashboardAnalytics: (baseUrl: string) => createUrl(baseUrl, 'GetSellerDashboardInfo/'),
};
