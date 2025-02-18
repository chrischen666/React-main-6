import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Cart() {
  useEffect(() => {
    getCart();
  }, []);
  //呼叫購物車
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCartData(res.data.data);

    } catch (error) {
      alert("購物車載入失敗");
    }
  };
  //結帳api
  const checkout = async (data) => {
    const { message, ...user } = data;
    setIsScreenLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order/`, {
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
  const onSubmit = (data) => {
    checkout(data);
  };
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [cartData, setCartData] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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

  return (
    <div className="container">
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
