const cart = [];

const handleCart = (state = cart, action) => {
  const product = action.payload;
  switch (action.type) {
    case "ADDITEM":
      // Xử lý khi thêm sản phẩm vào giỏ hàng
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng lên 1 đơn vị
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào với số lượng là 1
        return [...state, { ...product, qty: 1 }];
      }

    case "DELITEM":
      // Xử lý khi xóa sản phẩm khỏi giỏ hàng
      const exist2 = state.find((x) => x.id === product.id);
      if (exist2.qty === 1) {
        // Nếu sản phẩm chỉ còn 1 trong giỏ hàng, xóa nó đi
        return state.filter((x) => x.id !== exist2.id);
      } else {
        // Nếu sản phẩm có nhiều hơn 1 trong giỏ hàng, giảm số lượng đi 1 đơn vị
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty - 1 } : x
        );
      }

    case "REMOVEITEM":
      // Xử lý khi xóa hẳn sản phẩm khỏi giỏ hàng
      return state.filter((x) => x.id !== product.id);

    case "CLEARCART":
      // Xử lý khi xóa tất cả sản phẩm khỏi giỏ hàng
      return [];

    default:
      // Mặc định trả về trạng thái hiện tại nếu action không được nhận diện
      return state;
  }
};

export default handleCart;
