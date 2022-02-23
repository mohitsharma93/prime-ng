export interface IOrderRequestModel {
  endPoint: string,
  orderStatusId: number,
  urlMiddlePoint: string
}

export interface IOrderPostModel {
  OrderID: string,
  DetailID: string | null,
}

export interface IOrderCancelModel extends IOrderPostModel {
  Remark: string
}

export interface IOrderQuantityUpdateModel extends IOrderPostModel{
  Quantity: string
}