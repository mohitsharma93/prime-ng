import { createUrl } from '../base-url';

export const AdminOrderUrls = {
    getOrders: (baseUrl: string) => createUrl(baseUrl, ':orderStatusId/'),
    getOrderDetailRecord: (baseUrl: string) => createUrl(baseUrl, 'GetOrderDetailRecord/:orderId'),
    cancelOrder: (baseUrl: string) => createUrl(baseUrl, 'PostCancelOrderwithRemark'),
    updateQuantity: (baseUrl: string) => createUrl(baseUrl, 'PostUpdateBuyerOrderQuantity'),
    acceptOrder: (baseUrl: string) => createUrl(baseUrl, 'PostAddToAcceptOrder/:orderId'),
    addToShipmentOrder: (baseUrl: string) => createUrl(baseUrl, 'PostAddToShipmentOrder/:orderId'),
    addToDeliveredOrder: (baseUrl: string) => createUrl(baseUrl, 'PostAddToDeliveredOrder/:orderId'),
};
