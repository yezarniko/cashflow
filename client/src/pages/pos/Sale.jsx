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
  Checkbox,
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
import NotificationSound from "@assets/notification.mp3";
import EmptyCartIcon from "@assets/bag.png";
import CheckIcon from "@assets/check-gif.gif";
import ProductThumbnailImage from "@assets/Sale.png";

import { gql, useFragment, useMutation, useQuery } from "@apollo/client";
import { useUser } from "@hooks/useUser";
import { useDatabase } from "@hooks/useDatabase";
import { SearchBox } from "./Products";

import { ReactBarcode } from "react-jsbarcode";

import { useBranch } from "@hooks/useBranch";

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

  // const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
  //   variables: {
  //     userId: currentUser.uid,
  //     token: currentUser.accessToken,
  //     branchId: "97642144875",
  //     branchToken: "20746829937",
  //   },
  // });

  const [data, setData] = useState({
    products: [
      {
        productName: "Apple",
        count: 1,
        salePrice: 1500,
        img: "",
        category: "Fruits",
        productId: 202308040125,
      },
    ],
  });
  // const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const { productList, loading, deleteProduct } = useDatabase();
  const { currentBranch } = useBranch();
  const productsRef = useRef(null);

  useEffect(() => {
    if (productList) {
      if (productList[currentBranch]) {
        let Products = Object.values(productList[currentBranch]);
        Products.sort(
          (a, b) =>
            new Date(a.recentModifiedDate) - new Date(b.recentModifiedDate)
        ).reverse();
        productsRef.current = Products;
        setProducts(Products);
      }
    }
  }, [productList]);

  function addItemToCashList(product) {
    const data = {
      name: product.productName,
      price: product.salePrice,
      count: 1,
    };
    const existingProductIndex = cashList.findIndex(
      (p) => p.name === product.productName
    );
    console.log(cashList);
    console.log(existingProductIndex);

    if (existingProductIndex === -1) {
      console.log("RUN THIS");
      setCashList((cashList) => [...cashList, data]);
    } else {
      setCashList((cashList) =>
        cashList.map((p) =>
          p.name === product.productName ? { ...p, count: p.count + 1 } : p
        )
      );
    }
  }

  useEffect(() => {
    if (mode === "BarcodeScan") {
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
    } else {
      document.onkeyup = null;
      messageApi.destroy();
    }
    return () => {
      document.onkeyup = null;
      messageApi.destroy();
    };
  }, [mode]);

  useEffect(() => {
    if (mode === "BarcodeScan") {
      let barcode = "";

      document.onkeyup = (e) => {
        if (e.key === "Enter") {
          console.log(products);
          const product = products.find((product) => {
            console.log(product.productId);
            return product.productId == barcode;
          });
          console.log(barcode);
          console.log(product);

          if (product) {
            addItemToCashList(product);
            messageApi.open({
              type: "success",
              content: barcode,
              duration: 0.5,
            });
          }

          barcode = "";
        } else {
          if (!isNaN(e.key)) {
            barcode += e.key;
          }
        }
      };
    }
  }, [mode, cashList]);

  if (loading) {
    return <div>Lodaing...</div>;
  }

  return (
    <div className="sale">
      {contextHolder}
      <div className="sale__container">
        <div className="sale__products">
          <div className="sale__products__headbox mt-5">
            <SearchBox {...{ setProducts }} className="searchbox" />
            <ModeSelector mode={mode} setMode={setMode} />
          </div>
          <div className="sale__products__items">
            {products.map(
              (product) =>
                product.counts > 0 && (
                  <SaleProductItem
                    key={product.productName}
                    id={product.productId}
                    name={product.productName}
                    category={product.category}
                    price={product.salePrice}
                    buyingPrice={product.buyingPrice}
                    counts={product.counts}
                    img={
                      product.productImg !== ""
                        ? product.productImg
                        : ProductThumbnailImage
                    }
                  />
                )
            )}
          </div>
        </div>
        <CashList />
        <Payment currentUser={currentUser} />
      </div>
    </div>
  );
}

function SaleProductItem({
  id,
  name,
  counts,
  category,
  price,
  buyingPrice,
  img,
}) {
  const { cashList, setCashList } = useCashList();
  function handleAddedProduct() {
    const data = {
      id: id,
      name: name,
      price: price,
      count: 1,
      buyingPrice: buyingPrice,
    };

    const existingProductIndex = cashList.findIndex((p) => p.name === name);

    if (existingProductIndex === -1) {
      setCashList((cashList) => [...cashList, data]);
    } else {
      setCashList((cashList) =>
        cashList.map((p) =>
          p.name === name
            ? { ...p, count: p.count + 1 < counts ? p.count + 1 : p.count }
            : p
        )
      );
    }
  }

  return (
    <div className="sale__products__item">
      <div className="sale__products__item__img p-3">
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
      {/* <ReactBarcode
        className="mr-4"
        value={id}
        options={{
          format: `${id}`.length === 13 ? "EAN13" : "UPC",
          height: "50",
          fontSize: 11,
          margin: 0,
          // displayValue: false,
          width: 2,
          textAlign: "center",
          textMargin: 1,
          lineColor: "#827070",
        }}
      /> */}
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
        <div className="">
          <div className="w-1/2 text-right">Price</div>
          <div className="w-1/2"></div>
        </div>
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
  const [productName, setProductName] = useState(cashList[index].name);
  const [isExpand, setIsExpand] = useState(false);
  const qtyInputRef = useRef(null);

  useEffect(() => {
    let name = productName;

    if (name.length > 12) {
      name = name.slice(0, 12) + "...";
      setProductName(name);
    }
  }, []);

  function handleOnSaveChanges() {
    updateQty(parseInt(qtyInputRef.current.value));
    setIsExpand(false);
  }

  return (
    <div className="sale__cashlist__product__collapse">
      <div className="sale__cashlist__product">
        <div>{productName}</div>
        <div>{cashList[index].count}</div>
        <div>
          <div className="w-[55%] text-right">{cashList[index].price} ks</div>
          <div className="w-[40%] text-right">
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
  const [profits, setProfits] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [receipt, setReceipt] = useState(totalPrice);
  const isPrintRef = useRef(null);
  const bouncherRef = useRef(null);

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

  // const [SaleProduct, { loading }] = useMutation(SALE_PRODUCT);
  // const [AddSaleLog, { loading: l }] = useMutation(ADD_SALE_LOG);

  const { saleProduct } = useDatabase();

  const { currentBranch } = useBranch();

  function printMe(element) {
    var printContent = element.innerHTML;
    var originalContentHead = window.document.head.innerHTML;
    // var originalContent = window.document.body.innerHTML;
    // window.document.body.innerHTML = printContent;
    // window.print();
    // window.document.body.innerHTML = originalContent;
    var a = window.open("Print", "", "height=500, width=600");
    a.document.write(originalContentHead);
    a.document.write(printContent);
    a.document.close();
    a.print();
    a.close();
  }

  function handleOnCash() {
    if (cashList.length == 0) {
      messageApi.open({
        type: "warning",
        content: "Empty Cart",
        duration: 1,
      });
    } else {
      confirm({
        title: "",
        icon: null,
        okText: "Confirm",
        content: (
          <div className="ml-4 my-4 flex flex-col items-center w-full m-auto justify-center">
            <img src={CheckIcon} className="w-1/5 aspect-square" />
            <p
              style={{
                color: "var(--secondary-color)",
                fontWeight: "600",
                fontSize: "1.2em",
                marginTop: "1em",
              }}
            >
              Confirm Cash
            </p>

            <div ref={bouncherRef}>
              <div className="hidden mx-auto print:flex flex-col items-center bg-slate-100 text-sm font-mono min-h-full justify-between">
                <div className="w-full p-3">
                  {cashList.map((cash) => (
                    <p className="mb-2 flex justify-between w-full">
                      <span>
                        {cash.name.length > 15
                          ? cash.name.slice(0, 15) + "..."
                          : cash.name}
                      </span>
                      <span>{cash.price * cash.count} ks</span>
                    </p>
                  ))}
                  {/* {cashList.map((cash) => (
                  <p className="mb-2 flex justify-between w-full">
                    <span>
                      {cash.name.length > 15
                        ? cash.name.slice(0, 15) + "..."
                        : cash.name}
                    </span>
                    <span>{cash.price} ks</span>
                  </p>
                ))} */}
                </div>
                <div className="w-full p-3">
                  <div className="border-2 border-slate-200 w-full my-3"></div>
                  <p className="mb-2 flex justify-between w-full">
                    <span>Receipt:</span> <span>{receipt} ks</span>
                  </p>
                  <p className="mb-2 flex justify-between w-full">
                    <span>Exchange:</span>{" "}
                    <span>{receipt - totalPrice} ks</span>
                  </p>
                  <p className="mb-2 flex justify-between w-full">
                    <span>Total Price:</span> <span>{totalPrice} ks</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="my-4 py-3 flex flex-col items-center bg-slate-100 text-sm font-mono w-full">
              <div className="overflow-y-scroll h-60 w-full p-3">
                {cashList.map((cash) => (
                  <p className="mb-2 flex justify-between w-full">
                    <span>
                      {cash.name.length > 15
                        ? cash.name.slice(0, 15) + "..."
                        : cash.name}
                    </span>
                    <span>{cash.price * cash.count} ks</span>
                  </p>
                ))}
              </div>
              <div className="border-2 border-slate-200 w-full my-3"></div>
              <p className="mb-2 flex justify-between w-full">
                <span>Receipt:</span> <span>{receipt} ks</span>
              </p>
              <p className="mb-2 flex justify-between w-full">
                <span>Exchange:</span> <span>{receipt - totalPrice} ks</span>
              </p>
              <p className="mb-2 flex justify-between w-full">
                <span>Total Price:</span> <span>{totalPrice} ks</span>
              </p>
            </div>
            <div className="font-sans flex items-center w-full text-sm cursor-pointer">
              <input ref={isPrintRef} type="checkbox" className="mr-2" />
              <span
                onClick={() => {
                  isPrintRef.current.click();
                  console.log(isPrintRef.current.checked);
                }}
              >
                Print Receipt Bouncher
              </span>
            </div>
          </div>
        ),
        onOk() {
          let date = new Date();
          let Data = {
            date: date.toISOString(),
            totalPrice: totalPrice,
            profits: profits,
            products: cashList,
          };
          saleProduct(Data, currentBranch);
          setCashList([]);
          const audio = new Audio(NotificationSound);
          audio.play();
          messageApi.open({
            type: "success",
            content: "Cash Accepted",
            duration: 1,
          });
          if (isPrintRef.current.checked) printMe(bouncherRef.current);
        },
      });
    }
  }

  useEffect(() => {
    let prices = cashList.map((p) => p.price * p.count);
    let profits = cashList.map((p) => (p.price - p.buyingPrice) * p.count);
    setTotalPrice(prices.reduce((total, num) => total + num, 0));
    setProfits(profits.reduce((total, num) => total + num, 0));
  }, [cashList]);

  useEffect(() => {
    setReceipt(totalPrice);
  }, [totalPrice]);

  return (
    <div className="sale__payment">
      {contextHolder}
      <div className="flex flex-col h-[75%]">
        <div className="sale__payment__total mt-2">
          <p>Receipt</p>
          <p>
            <input
              type="number"
              value={receipt}
              onChange={(e) => setReceipt(e.target.value)}
              className="w-24 text-right outline-none border-2 mr-2 p-1 border-emerald-300/50"
            />
            ks
          </p>
        </div>
        <div className="sale__payment__total">
          <p>Exchange</p>
          <p>
            {/* <input
              type="number"
              value={receipt - totalPrice}
              className="w-20 text-right outline-none border-2 mr-2 tex-sm"
            /> */}
            {receipt - totalPrice} ks
          </p>
        </div>
        <div className="sale__payment__total text-lg">
          <p className="text-slate-600">Total</p>
          <p className="text-emerald-500">{totalPrice} ks</p>
        </div>
      </div>
      <div className="sale__payment__pay grow" onClick={handleOnCash}>
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
            <div className="flex items-center justify-center">
              <ShoppingCartOutlined className="mr-1" />
              Manual
            </div>
          ),
          value: "Product",
        },
        {
          label: (
            <div className="flex items-center justify-center">
              <BarcodeOutlined className="mr-1" />
              Barcode Scan
            </div>
          ),
          value: "BarcodeScan",
        },
        {
          label: (
            <div className="flex items-center justify-center">
              <ScanOutlined className="mr-1" />
              Webcam Scan
            </div>
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
