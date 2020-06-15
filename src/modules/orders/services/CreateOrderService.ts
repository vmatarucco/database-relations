import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Invalid Customer ID');
    }

    const findProducts = await this.productsRepository.findAllById(products);

    if (findProducts.length !== products.length) {
      throw new AppError('Products not found');
    }

    const listProducts = findProducts.map(findProduct => {
      const product = products.find(p => p.id === findProduct.id);

      if (!product) {
        throw new AppError(' This product could not be found');
      }

      if (product.quantity > findProduct.quantity) {
        throw new AppError("There's not enough stock for this quantity");
      }

      return {
        product_id: findProduct.id,
        price: findProduct.price,
        quantity: product.quantity,
      };
    });

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: listProducts,
    });

    return order;
  }
}

export default CreateOrderService;
