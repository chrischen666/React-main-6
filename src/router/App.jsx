import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";

import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    checkout(data);
  };

  //取得產品
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsScreenLoading(true);
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert("取得產品失敗");
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProducts();
    getCart();
  }, []);

  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleSeeMore = (product) => {
    setTempProduct(product);
    openModal();
  };

  const [qtySelect, setQtySelect] = useState(1);

  //加入購物車
  const addCartItem = async (id, qty) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id: id,
          qty: Number(qty),
        },
      });
      getCart();
    } catch (error) {
      alert("加入購物車失敗");
    } finally {
      setIsLoading(false);
    }
  };
  const [cartData, setCartData] = useState({});
  //呼叫購物車
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCartData(res.data.data);
    } catch (error) {
      alert("購物車載入失敗");
    }
  };

  //清空購物車
  const removeCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      alert("清空失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  //刪除單一購物車
  const removeCartItem = async (id) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`);
      getCart();
    } catch (error) {
      alert("刪除失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };
  //更新購物車
  const updateCartItem = async (cartId, productId, qty) => {
    setIsScreenLoading(true);
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartId}`, {
        data: {
          product_id: productId,
          qty: qty,
        },
      });
      getCart();
    } catch (error) {
      alert("更新失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  //結帳api
  const checkout = async (data) => {
    const { message, ...user } = data;
    setIsScreenLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order/`, {
        data: {
          user,
          message,
        },
      });
      getCart();
      reset();
    } catch (error) {
      alert("送出表單失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container">
      <div className="mt-4">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img
                    className="img-fluid"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      onClick={() => handleSeeMore(product)}
                      type="button"
                      className="btn btn-outline-secondary"
                    >
                      查看更多
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger d-flex align-items-center gap-2"
                      onClick={() => {
                        addCartItem(product.id, 1);
                      }}
                    >
                      加入購物車
                      {isLoading && (
                        <ReactLoading
                          type={"spin"}
                          color={"#000"}
                          height={"1.5rem"}
                          width={"1.5rem"}
                        />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          ref={productModalRef}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          className="modal fade"
          id="productModal"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  產品名稱：{tempProduct.title}
                </h2>
                <button
                  onClick={closeModal}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={tempProduct.imageUrl}
                  alt={tempProduct.title}
                  className="img-fluid"
                />
                <p>內容：{tempProduct.content}</p>
                <p>描述：{tempProduct.description}</p>
                <p>
                  價錢：{tempProduct.price}{" "}
                  <del>{tempProduct.origin_price}</del> 元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
                  <select
                    value={qtySelect}
                    onChange={(e) => setQtySelect(e.target.value)}
                    id="qtySelect"
                    className="form-select"
                  >
                    {Array.from({ length: 10 }).map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                {/* <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    addCartItem(tempProduct.id, qtySelect);
                  }}
                >
                  加入購物車
                </button> */}
                <button
                  disabled={isLoading}
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={() => {
                    addCartItem(tempProduct.id, qtySelect);
                  }}
                >
                  加入購物車
                  {isLoading && (
                    <ReactLoading
                      type={"spin"}
                      color={"#000"}
                      height={"1.5rem"}
                      width={"1.5rem"}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {cartData.carts?.length > 0 && (
          <>
            <div className="text-end py-3">
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={removeCart}
              >
                清空購物車
              </button>
            </div>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: "150px" }}>數量/單位</th>
                  <th className="text-end">單價</th>
                </tr>
              </thead>
              <tbody>
                {cartData.carts?.map((cartItem) => {
                  return (
                    <tr key={cartItem.id}>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeCartItem(cartItem.id)}
                        >
                          x
                        </button>
                      </td>
                      <td>{cartItem.product.title}</td>
                      <td style={{ width: "150px" }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              disabled={cartItem.qty === 1}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => {
                                updateCartItem(
                                  cartItem.id,
                                  cartItem.product_id,
                                  cartItem.qty - 1
                                );
                              }}
                            >
                              -
                            </button>
                            <span
                              className="btn border border-dark"
                              style={{ width: "50px", cursor: "auto" }}
                            >
                              {cartItem.qty}
                            </span>
                            <button
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => {
                                updateCartItem(
                                  cartItem.id,
                                  cartItem.product_id,
                                  cartItem.qty + 1
                                );
                              }}
                            >
                              +
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">
                            {cartItem.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">{cartItem.product.price}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    總計：
                  </td>
                  <td className="text-end" style={{ width: "130px" }}>
                    {cartData.total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>

      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "email必填",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "email格式錯誤",
                },
              })}
              id="email"
              type="email"
              className={`form-control ${errors.email && "is-invalid"}`}
              placeholder="請輸入 Email"
            />
            {errors.email && (
              <p className="text-danger my-2">{errors.email?.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              className={`form-control ${errors.name && "is-invalid"}`}
              placeholder="請輸入姓名"
              {...register("name", {
                required: {
                  value: true,
                  message: "姓名必填",
                },
              })}
            />

            {errors.name && (
              <p className="text-danger my-2">{errors.name?.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              type="text"
              className={`form-control ${errors.tel && "is-invalid"}`}
              placeholder="請輸入電話"
              {...register("tel", {
                required: {
                  value: true,
                  message: "電話必填",
                },
                pattern: {
                  value: /^(0[2-8]\d{7}|09\d{8})$/,
                  message: "電話格式錯誤",
                },
              })}
            />

            {errors.tel && (
              <p className="text-danger my-2">{errors.tel?.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              type="text"
              className={`form-control ${errors.address && "is-invalid"}`}
              placeholder="請輸入地址"
              {...register("address", {
                required: {
                  value: true,
                  message: "地址必填",
                },
              })}
            />

            {errors.address && (
              <p className="text-danger my-2">{errors.address?.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              {...register("message")}
              id="message"
              className={`form-control ${errors.message && "is-invalid"}`}
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </div>
  );
}

export default App;
