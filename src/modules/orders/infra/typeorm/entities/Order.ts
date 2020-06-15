import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Column,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* ------------------ CUSTOMER - ORDER ------------------ */
  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  customer_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /* ------------------ ORDER - ORDERS_PRODUCTS  ------------------ */
  @OneToMany(() => OrdersProducts, ordersProducts => ordersProducts.order, {
    cascade: true,
    eager: true,
  })
  order_products: OrdersProducts[];
}

export default Order;
