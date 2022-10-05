import {IProduct} from "./IProduct";

export interface ICart {
  id: string;
  productList: { count: number, product: IProduct }[]
  subTotal: number;
  taxTotal: number;
  shippingTotal: number;
  costTotal: number;
}
