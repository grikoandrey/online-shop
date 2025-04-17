export interface FavoriteType {
  id: string,
  name: string,
  price: number,
  image: string,
  url: string,
  count?: number,
  countInCart?: number;
}
