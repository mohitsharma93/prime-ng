import { createUrl } from '../base-url';

export const AdminOrderUrls = {
    getOrders: (baseUrl: string) => createUrl(baseUrl, ':orderStatusId/'),
    getOrderDetailRecord: (baseUrl: string) => createUrl(baseUrl, ':orderId'),
    cancelOrder: (baseUrl: string) => createUrl(baseUrl, 'PostCancelOrderwithRemark'),
    updateQuantity: (baseUrl: string) => createUrl(baseUrl, 'PostUpdateBuyerOrderQuantity'),
    acceptOrder: (baseUrl: string) => createUrl(baseUrl, 'PostAddToAcceptOrder/:orderId'),
    addBulkToShipmentOrder: (baseUrl: string) => createUrl(baseUrl, 'PostCreateNewShipment'),
    addToShipmentOrder: (baseUrl: string) => createUrl(baseUrl, 'PostAddtoShipmentOrder/:orderId'),
    addToDeliveredOrder: (baseUrl: string) => createUrl(baseUrl, 'PostAddToDeliveredOrder/:orderId'),
    deliveredSelected: (baseUrl: string) => createUrl(baseUrl, 'PostBulkOrderAddtoDelivered'),
    canceledSelected: (baseUrl: string) => createUrl(baseUrl, 'PostBulkOrderAddtoCancel/:remark'),
    getBulkAcceptOrderData: (baseUrl: string) => createUrl(baseUrl, 'GetBulkAcceptOrderData'),
    deliveredOrder: (baseUrl: string) => createUrl(baseUrl, 'PostAddToDeliveredOrder/:orderId'),
    getReviewShipment: (baseUrl: string) => createUrl(baseUrl, 'getReviewShipmentData'),
    bulkOrderAddtoAccept: (baseUrl: string) => createUrl(baseUrl, 'PostBulkOrderAddtoAccept')
};
