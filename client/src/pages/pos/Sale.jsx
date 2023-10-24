import React, { useEffect, useRef, useState } from "react";

import { useCashList, CashListContextProvider } from "@hooks/useCashList";

import {
  Radio,
  message,
  Popover,
  Select,
  InputNumber,
  Modal,
  Button,
  Empty,
} from "antd";
const { confirm } = Modal;

import {
  BarcodeOutlined,
  ShoppingCartOutlined,
  ScanOutlined,
  PlusOutlined,
  CloseSquareOutlined,
  RightSquareOutlined,
  DownSquareOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import ScannerIcon from "@assets/scanner.gif";
import SearchIcon from "@assets/search.gif";
import CocaImg from "@assets/coca.png";
import OvaltineImg from "@assets/ovaltine.jpg";
import NotificationSound from "@assets/store-scanner-beep-90395.mp3";
import EmptyCartIcon from "@assets/bag.png";
import CheckIcon from "@assets/check-gif.gif";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useUser } from "@hooks/useUser";

const PRODUCTS = [
  {
    name: "Coca Cola",
    category: "beverage",
    price: 2000,
    img: CocaImg,
  },
  {
    name: "Overtine",
    category: "beverage",
    price: 2000,
    img: OvaltineImg,
  },
  {
    name: "Apple",
    price: 1.5,
    category: "Fruits",
    img: "https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=612x612&w=0&k=20&c=NvO-bLsG0DJ_7Ii8SSVoKLurzjmV0Qi4eGfn6nW3l5w=",
  },
  {
    name: "Milk",
    price: "2.75",
    category: "Dairy",
    img: "https://media.istockphoto.com/id/172764098/photo/tall-glass-of-milk-against-a-white-background.jpg?s=612x612&w=0&k=20&c=9c6noAWk5xrzL0cgrozrBuYfRlcSaDNADcNAiHbcGZU=",
  },
  {
    name: "Bread",
    price: 2.0,
    category: "Bakery",
    img: "https://www.goldmedalbakery.com/content/uploads/2019/12/Sandwich-White.jpg",
  },
  {
    name: "Cereal",
    price: 3.25,
    category: "Breakfast",
    img: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1682445551-cocoa-puffs-644814e84bc6d.jpg?crop=1xw:1xh;center,top&resize=980:*",
  },
  {
    name: "Eggs",
    price: 2.5,
    category: "Dairy",
    img: "https://kidseatincolor.com/wp-content/uploads/2022/02/eggs-e1648216350119-500x500.jpeg",
  },
  {
    name: "Chicken Breast",
    price: 5.5,
    category: "Meat",
    img: "https://m.media-amazon.com/images/I/71WKPGojsmL._SL1500_.jpg",
  },
  {
    name: "Tomato",
    price: 0.75,
    category: "Vegetables",
    img: "https://img.etimg.com/thumb/width-640,height-480,imgsize-56196,resizemode-75,msid-95423731/magazines/panache/5-reasons-why-tomatoes-should-be-your-favourite-fruit-this-year/tomatoes-canva.jpg",
  },
];

const GET_PRODUCTS = gql`
  query getProducts(
    $userId: String!
    $token: String!
    $branchId: String!
    $branchToken: String!
  ) {
    products(
      userId: $userId
      token: $token
      branchId: $branchId
      branchToken: $branchToken
    ) {
      productImg
      productName
      productId
      category
      brand
      buyingPrice
      salePrice
      domainCounts
      counts
      recentModifiedDate
    }
  }
`;

function Sale() {
  const [mode, setMode] = useState("Product");
  const { currentUser } = useUser();
  const { cashList, setCashList } = useCashList();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      userId: currentUser.uid,
      token: currentUser.accessToken,
      branchId: "97642144875",
      branchToken: "20746829937",
    },
  });

  useEffect(() => {
    if (data) {
      console.log("refetch");
      refetch();
    }
  }, []);

  useEffect(() => {
    if (mode === "BarcodeScan") {
      let barcode = "";
      messageApi.open({
        type: "loading",
        content: (
          <Popover
            content={
              <ul style={{ color: "var(--secondary-color)" }}>
                <li>
                  Ensure the barcode scanner is plugged in correctly before use.
                </li>
                <li>
                  Hold the barcode scanner at an appropriate distance to the
                  barcode.
                </li>
                <li>Make sure the barcode is clean and undamaged.</li>
              </ul>
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={ScannerIcon}
                style={{ width: "18px", marginRight: ".4em" }}
              />
              Scanning
            </div>
          </Popover>
        ),
        duration: 0,
        icon: <></>,
      });
      document.onkeyup = (e) => {
        if (e.key === "Enter") {
          const product = data.products.find(
            (product) => product.productId == barcode
          );
          console.log(product);

          if (product) {
            const data = {
              name: product.productName,
              price: product.salePrice,
              count: 1,
            };
            const existingProductIndex = cashList.findIndex(
              (p) => p.name === product.productName
            );

            if (existingProductIndex === -1) {
              setCashList((cashList) => [...cashList, data]);
            } else {
              setCashList((cashList) =>
                cashList.map((p) =>
                  p.name === product.productName
                    ? { ...p, count: p.count + 1 }
                    : p
                )
              );
            }
          }

          messageApi.open({ type: "success", content: barcode, duration: 0.5 });
          barcode = "";
        } else {
          if (!isNaN(e.key)) {
            barcode += e.key;
          }
        }
      };
    } else {
      document.onkeyup = null;
      messageApi.destroy();
    }
    return () => {
      document.onkeyup = null;
      messageApi.destroy();
    };
  }, [mode]); //

  if (loading) {
    return <div>Lodaing...</div>;
  }

  return (
    <div className="sale">
      {contextHolder}
      <div className="sale__container">
        <div className="sale__products">
          <div className="sale__products__headbox">
            <Search />
            <ModeSelector mode={mode} setMode={setMode} />
          </div>
          <div className="sale__products__items">
            {data.products.map((product) => (
              <SaleProductItem
                key={product.productName}
                name={product.productName}
                category={product.category}
                price={product.salePrice}
                img={product.productImg}
              />
            ))}
          </div>
        </div>
        <CashList />
        <Payment currentUser={currentUser} />
      </div>
    </div>
  );
}

function SaleProductItem({ name, category, price, img }) {
  const { cashList, setCashList } = useCashList();
  function handleAddedProduct() {
    const data = { name: name, price: price, count: 1 };

    const existingProductIndex = cashList.findIndex((p) => p.name === name);

    if (existingProductIndex === -1) {
      setCashList((cashList) => [...cashList, data]);
    } else {
      setCashList((cashList) =>
        cashList.map((p) =>
          p.name === name ? { ...p, count: p.count + 1 } : p
        )
      );
    }
  }

  return (
    <div className="sale__products__item">
      <div className="sale__products__item__img">
        <img src={img} />
      </div>
      <div>
        <div className="sale__products__item__name">{name}</div>
        <div>
          <div className="sale__products__item__category">
            <span>Category:</span> {category}
          </div>
          <div className="sale__products__item__price">
            <span>Price:</span> {price}ks
          </div>
        </div>
      </div>
      <div className="sale__products__item__plus" onClick={handleAddedProduct}>
        <PlusOutlined
          style={{
            marginRight: "1em",
            fontSize: "1.5em",
            fontWeight: "900",
          }}
        />
      </div>
    </div>
  );
}

function CashList() {
  const { cashList, setCashList } = useCashList();

  function deleteProductFromCashList(key) {
    setCashList(cashList.filter((product) => product.name != key));
  }
  function changeQty(key, newQty) {
    setCashList((cashList) => {
      const updatedList = cashList.map((product) =>
        product.name === key ? { ...product, count: newQty } : product
      );
      return updatedList;
    });
  }

  return (
    <div className="sale__cashlist">
      <div className="sale__cashlist__header">
        <div>Product</div>
        <div>Qty</div>
        <div>Price</div>
      </div>
      <div className="sale__cashlist__products">
        {cashList.length != 0 ? (
          cashList.map((product, index) => (
            <CashListProductItem
              key={product.name}
              index={index}
              deleteProduct={() => deleteProductFromCashList(product.name)}
              updateQty={(newQty) => changeQty(product.name, newQty)}
            />
          ))
        ) : (
          <div className="sale__cashlist__products__empty_cart">
            <div className="sale__cashlist__products__empty_cart__img">
              <img src={EmptyCartIcon} />
            </div>
            Empty Cart
          </div>
        )}
      </div>
    </div>
  );
}

function CashListProductItem({ index, deleteProduct, updateQty }) {
  const { cashList } = useCashList();
  const [isExpand, setIsExpand] = useState(false);
  const qtyInputRef = useRef(null);

  function handleOnSaveChanges() {
    updateQty(parseInt(qtyInputRef.current.value));
    setIsExpand(false);
  }

  return (
    <div className="sale__cashlist__product__collapse">
      <div className="sale__cashlist__product">
        <div>{cashList[index].name}</div>
        <div>{cashList[index].count}</div>
        <div>
          {cashList[index].price} ks
          <div>
            {isExpand ? (
              <DownSquareOutlined
                className="sale__cashlist__product__expand-icon"
                onClick={() => setIsExpand((v) => !v)}
                style={{ color: "#1ABC9C" }}
              />
            ) : (
              <RightSquareOutlined
                className="sale__cashlist__product__expand-icon"
                onClick={() => setIsExpand((v) => !v)}
              />
            )}
            <CloseSquareOutlined
              className="sale__cashlist__product__close-icon"
              onClick={deleteProduct}
            />
          </div>
        </div>
      </div>
      {isExpand ? (
        <div className="sale__cashlist__product__expand">
          Quantity:{" "}
          <InputNumber
            size="small"
            className="sale__cashlist__product__expand__input"
            min={1}
            defaultValue={cashList[index].count}
            controls={true}
            ref={qtyInputRef}
            onPressEnter={handleOnSaveChanges}
          />
          <CheckCircleFilled
            className="sale__cashlist__product__expand__save"
            onClick={handleOnSaveChanges}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function Payment({ currentUser }) {
  const { cashList, setCashList } = useCashList();
  const [totalPrice, setTotalPrice] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const SALE_PRODUCT = gql`
    mutation SaleProduct(
      $userId: String!
      $accountToken: String!
      $cashList: [CashListInput]
    ) {
      saleProduct(
        userId: $userId
        accountToken: $accountToken
        branchId: "97642144875"
        branchToken: "20746829937"
        cashList: $cashList
      ) {
        productName
        domainCounts
        counts
      }
    }
  `;
  const ADD_SALE_LOG = gql`
    mutation AddSaleLog(
      $userId: String!
      $accountToken: String!
      $saleLog: SaleLogInput
      $products: [CashListInput]
    ) {
      addSaleLog(
        userId: $userId
        accountToken: $accountToken
        branchId: "97642144875"
        branchToken: "20746829937"

        saleLog: $saleLog
        products: $products
      ) {
        productName
        domainCounts
        counts
      }
    }
  `;

  const [SaleProduct, { loading }] = useMutation(SALE_PRODUCT);

  const [AddSaleLog, { loading: l }] = useMutation(ADD_SALE_LOG);

  function handleOnCash() {
    if (cashList.length == 0) {
      messageApi.open({
        type: "warning",
        content: "Empty Cart",
        duration: 1,
      });
    } else {
      confirm({
        title: "Confirm Cash",
        icon: null,
        okText: "Confirm",
        content: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div style={{ height: "30%", margin: "2em 0" }}>
              <img src={CheckIcon} />
            </div>
            <p
              style={{
                color: "var(--secondary-color)",
                fontWeight: "600",
                fontSize: "1.2em",
              }}
            >
              Amount: {totalPrice} ks
            </p>
          </div>
        ),
        onOk() {
          console.log(cashList);
          SaleProduct({
            variables: {
              userId: currentUser.uid,
              accountToken: currentUser.accessToken,
              cashList: cashList,
            },
          }).then(() => {
            AddSaleLog({
              variables: {
                userId: currentUser.uid,
                accountToken: currentUser.accessToken,
                saleLog: { customer_id: Math.floor(Math.random() * 10000), amount: totalPrice, isOrder: false },
                products: cashList,
              },
            });
            console.log(cashList);
            setCashList([]);
            messageApi.open({
              type: "success",
              content: "Cash Accepted",
              duration: 1,
            });
          });
        },
      });
    }
  }

  useEffect(() => {
    let prices = cashList.map((p) => p.price * p.count);
    setTotalPrice(prices.reduce((total, num) => total + num, 0));
  }, [cashList]);

  return (
    <div className="sale__payment">
      {contextHolder}
      <div className="sale__payment__total">
        <p>Total</p>
        <p>
          {totalPrice}
          ks
        </p>
      </div>
      <div className="sale__payment__pay" onClick={handleOnCash}>
        <p>Cash</p>
      </div>
    </div>
  );
}

/**
 * Notification Sound Handler
 *
 * @function
 * @memberof OrderListInput
 * @returns {void}
 */
function playNotificationSound() {
  const audio = new Audio(NotificationSound);
  audio.play();
}

function Search() {
  const [searchResult, setSearchResult] = useState("");

  return (
    <div className="search">
      <div className="searchbox">
        <input
          type="text"
          onChange={(e) => {
            setSearchResult(e.target.value);
          }}
        />
        <span className="searchbox__icon">
          <img src={SearchIcon} />
        </span>
      </div>
      {searchResult ? (
        <div className="search_result">
          <div className="search_result__item">
            {searchResult}
            <span>900 ks</span>
          </div>
          <div className="search_result__item">
            Line Pen<span>800 ks</span>
          </div>
          <div className="search_result__item">
            Garnier face mask<span>1200 ks</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function ModeSelector({ mode, setMode }) {
  return (
    <Radio.Group
      options={[
        {
          label: (
            <>
              <ShoppingCartOutlined />
              {"  "}Manual
            </>
          ),
          value: "Product",
        },
        {
          label: (
            <>
              <BarcodeOutlined />
              {"  "}Barcode Scan
            </>
          ),
          value: "BarcodeScan",
        },
        {
          label: (
            <>
              <ScanOutlined />
              {"  "}Webcam Scan
            </>
          ),
          value: "WebcamScan",
        },
      ]}
      onChange={(e) => {
        setMode(e.target.value);
      }}
      onClick={null}
      value={mode}
      optionType="button"
    />
  );
}

export default Sale;
