import { createUrl } from '../base-url';

export const AdminOrderUrls = {
    getOrders: (baseUrl: string) => createUrl(baseUrl, ':orderStatusId/'),
    getOrderDetailRecord: (baseUrl: string) => createUrl(baseUrl, 'GetOrderDetailRecord/:orderId'),
    cancelOrder: (baseUrl: string) => createUrl(baseUrl, 'PostCancelOrderwithRemark'),
    updateQuantity: (baseUrl: string) => createUrl(baseUrl, 'PostUpdateBuyerOrderQuantity'),
};
