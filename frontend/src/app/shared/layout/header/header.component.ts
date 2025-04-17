import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationEnd, Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime, filter} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activeFragment = '';

  // searchValue: string = '';
  products: ProductType[] = [];

  serverStaticPath: string = environment.serverStaticPath;

  isLogged = false;
  count = 0;
  @Input() categories: CategoryWithTypeType[] = [];

  showedSearch = false;

  searchField = new FormControl();


  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private productService: ProductService,
              private cartService: CartService,) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        this.activeFragment = tree.fragment || '';
      });

    this.searchField.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showedSearch = true;
            });
        } else {
          this.products = [];
        }
      })


    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount().subscribe((data: { count: number } | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.count = (data as { count: number }).count;
    });

    this.cartService.count$.subscribe((count: number): void => {
      this.count = count;
    })
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  };

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Успешный выход!');
    this.router.navigate(['/']);
  };

  // changeSearchValue(newValue: string): void {
  //   this.searchValue = newValue;
  //
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProducts(this.searchValue)
  //       .subscribe((data: ProductType[]) => {
  //         this.products = data;
  //         this.showedSearch = true;
  //       });
  //   } else {
  //     this.products = [];
  //   }
  // };

  selectProduct(url: string): void {
    this.router.navigate([`/product/${url}`]);
    // this.searchValue = '';
    this.searchField.setValue('');
    this.products = [];
  };

  // changeShowedSearch(value: boolean): void {
  //   setTimeout(() => {
  //     this.showedSearch = value;
  //   }, 200);
  // };

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    if (this.showedSearch && (event.target as HTMLInputElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }
}
