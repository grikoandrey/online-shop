import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductType} from "../../../../types/product.type";
import {ProductService} from "../../../shared/services/product.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  recommendedProducts: ProductType[] = [];
  product!: ProductType;
  serverStaticPath: string = environment.serverStaticPath;

  count: number = 1;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          this.product = data;
          //здесь можно добавить, что в случае отсутствия данных о товаре, мы переводим пользователя на страницу
          // 404, что является лучшей и безопасной практикой.
        });
    });

    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts = data;
      });
  };
  updateCount(value: number): void {
    this.count = value;
  };

  addToCard(): void {
    alert(`Добавлено в корзину: ${this.count}`);
  };

}
