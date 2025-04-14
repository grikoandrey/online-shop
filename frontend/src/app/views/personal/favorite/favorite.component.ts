import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  serverStaticPath: string = environment.serverStaticPath;

  count: number = 1;
  product!: ProductType;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) {
  }

  ngOnInit(): void {
    // 1. Получаем избранные товары
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {

        if ((data as DefaultResponseType).error !== undefined) {
          const error: string = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavoriteType[];

        // 2. Получаем корзину
        this.cartService.getCart()
          .subscribe((cartData: CartType | DefaultResponseType) => {

            if ((cartData as DefaultResponseType).error !== undefined) {
              throw new Error((cartData as DefaultResponseType).message);
            }

            const cartDataResponse = cartData as CartType;

            // 3. Проходим по всем товарам из избранного
            this.products.forEach(favItem => {
              const inCart = cartDataResponse.items.find(cartItem =>
                cartItem.product.id === favItem.id
              );

              // 4. Если нашли товар в корзине — устанавливаем флаги
              favItem.countInCart = inCart ? inCart.quantity : 0;
            });
          });
      });
  };

  addToCard(product: FavoriteType): void {
    this.cartService.updateCart(product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        product.countInCart = this.count;
      })
  };

  removeFromCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        product.countInCart = 0;
        this.count = 1;
      })
  };

  updateCount(newCount: number, product: FavoriteType): void {
    if (product.countInCart) {
      this.cartService.updateCart(product.id, newCount)
        .subscribe((data: CartType | DefaultResponseType): void => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          product.countInCart = newCount;
        });
    }
  };

  removeFromFavorite(id: string): void {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          //.....можно вывести в консоль или снек-бар
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  };
}
