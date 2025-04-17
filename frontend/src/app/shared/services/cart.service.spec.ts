import {CartService} from "./cart.service";
import {of} from "rxjs";

describe('cart service', () => {

  let cartService: CartService;
  const countValue = 3;

  beforeEach(() => {

    const valueServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
    valueServiceSpy.get.and.returnValue(of({count: countValue}));

    cartService = new CartService(valueServiceSpy);
  });

  it('should emit new count value', (done: DoneFn) => {
    cartService.count$.subscribe(count => {
      expect(count).toBe(3);
      done();
    });

    cartService.getCartCount().subscribe();
  });


});
