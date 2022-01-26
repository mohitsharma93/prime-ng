import { createUrl } from '../base-url';

export const AdminOrderUrls = {
    getOrders: (baseUrl: string) => createUrl(baseUrl, ':orderStatusId/'),
};
