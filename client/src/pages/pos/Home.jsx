// @ts-check
// React
import React, { useEffect, useRef, useState } from "react";

// Ant Design is a comprehensive and popular UI library
// It offers a wide range of reusable and customizable React components
import { Form, Input, InputNumber, Modal, Button, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
const { TextArea } = Input;

// Yup is a powerful validation library used for form validation,
// data schema validation, and more, providing a concise and declarative way to define validation rules.
import * as Yup from "yup";

// Asset imports
import FlagImg from "@assets/Flag_of_Myanmar.svg";
import PlusIcon from "@assets/add.png";
import BestSellerImage from "@assets/bestseller.png";
import ProductImg from "@assets/herballines-shampoo.png";
import NotificationSound from "@assets/notification.mp3";
import RemovedProductImg from "@assets/delete-product.png";

import { useUser } from "@/hooks/useUser";
import { gql, useQuery } from "@apollo/client";
import { useDatabase } from "@hooks/useDatabase";
import { useBranch } from "@hooks/useBranch";

/**
 * The `Home` function is a React component that represents the home page.
 * It returns a JSX element that contains the necessary HTML structure and components for rendering the home page.
 * The `Home` component includes three child components: `RecentSaleDash`, `Upsale`, and `OrderList`.
 *
 * @function
 * @name Home
 * @kind function
 * @returns {React.JSX.Element}
 */
function Home() {
  const { currentUser } = useUser();

  const GET_RECENT_SALE_LOGS = gql`
    query GetRecentSaleLogs(
      $userId: String!
      $token: String!
      $branchId: String!
      $branchToken: String!
    ) {
      recentSaleLogs(
        userId: $userId
        token: $token
        branchId: $branchId
        branchToken: $branchToken
      ) {
        name
        price
        count
        productImg
      }
    }
  `;

  // const { data, loading, error, refetch } = useQuery(GET_RECENT_SALE_LOGS, {
  //   variables: {
  //     userId: currentUser.uid,
  //     token: currentUser.accessToken,
  //     branchId: "97642144875",
  //     branchToken: "20746829937",
  //   },
  // });

  const [loading, setLoading] = useState(true);
  const { sales } = useDatabase();
  const { currentBranch } = useBranch();
  const [recentSaleLogs, setRecentSaleLogs] = useState([]);

  useEffect(() => {
    if (sales) {
      setLoading(false);
      console.log("sales: ", sales);
    }
  });

  useEffect(() => {
    const date = new Date();

    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    if (sales) {
      if (sales[currentBranch]) {
        console.log("today sales: ", sales[currentBranch]);
        console.log(formattedDate);
        if (sales[currentBranch][formattedDate]) {
          const todaySales = sales[currentBranch][formattedDate];
          console.log("today sales: ", todaySales);

          let todaySaleProducts = Object.values(todaySales)
            .map((sale) => sale.products)
            .flat(1);

          todaySaleProducts.reverse();

          console.log(todaySaleProducts);

          // todaySaleProducts = Object.values(
          //   todaySaleProducts.reduce((acc, item) => {
          //     if (!acc[item.id]) {
          //       acc[item.id] = { ...item };
          //     } else {
          //       acc[item.id].count += item.count;
          //     }
          //     return acc;
          //   }, {})
          // );

          setRecentSaleLogs(todaySaleProducts);
        }
      }
    }
  }, [sales]);

  if (loading) return <>Loading...!!!</>;
  if (!loading) {
    return (
      <div className="home">
        <RecentSaleDash data={recentSaleLogs} {...{ loading, currentBranch }} />
        <Upsale data={recentSaleLogs} />
        <OrderList />
      </div>
    );
  }
}

/**
 * The `RecentSaleDash` function is a React component that represents the recent sale dashboard section of the home page.
 *
 * @function
 * @name RecentSaleDash
 * @kind functionrgba(190, 209, 246, 0.5)
 * @returns {React.JSX.Element}
 */
function RecentSaleDash({ data, loading, currentBranch }) {
  useEffect(() => {
    console.log("render Recent Sale!");
  });

  return (
    <div className="home__recent_sale">
      <div className="home__recent_sale__header">
        <div className="home__recent_sale__header__total_sale">
          Today Sale :{" "}
          <span>{data?.reduce((c, b) => c + b.price * b.count, 0)}</span>
          <span>ks</span>
        </div>
        <DateAndTime />
      </div>
      <RecentSaleTable {...{ data, loading, currentBranch }} />
    </div>
  );
}

/**
 * The `RecentSaleTable` function is a React component that represents the table of recent sales.
 * It renders a table with headers for "Products", "Counts", and "Amounts", and a list of `RecentSaleTableContent` components that display the product image, name, count, and amount for each recent sale.
 * The function also includes a `useRef` hook to get a reference to the table element and a `useEffect` hook to set the position of the table based on the window height.
 *
 * @function
 * @name RecentSaleTable
 * @kind function
 * @returns {React.JSX.Element}
 */
function RecentSaleTable({ data, loading, currentBranch }) {
  // Create a reference to the table element using the useRef hook
  const tableRef = useRef(null);

  // useEffect hook to set the position of the table based on the window height
  useEffect(() => {
    if (!loading && data) {
      // Get the current table element using the ref
      const table = tableRef.current;

      // Get the current position of the table
      const currentPosition = table.offsetTop;

      // Get the window height to calculate the bottom offset
      const windowHeight = window.innerHeight;
      const bottomOffset = windowHeight * 0.05; // 5% of window height

      // Set the table position using inline styles
      table.style.top = `${currentPosition}px`;
      table.style.bottom = `${bottomOffset}px`;
    }
  }, [loading]);

  if (loading) return <>Loading..!!</>;
  if (!data) return <>Loading..!!</>;

  return (
    <>
      <h3>Recent Sales</h3>
      <div ref={tableRef} className="home__recent_sale__table">
        <div className="home__recent_sale__table__header">
          <div>Products</div>
          <div>Counts</div>
          <div>Amounts</div>
        </div>
        <div className="home__recent_sale__table__contents">
          {data.length > 0 ? (
            data.map((s) =>
              s.name ? (
                <RecentSaleTableContent
                  key={`${s.name}${s.count}${Math.random()}`}
                  {...s}
                  currentBranch={currentBranch}
                />
              ) : (
                ""
              )
            )
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontWeight: "600",
                  fontSize: ".9rem",
                }}
              >
                <InboxOutlined
                  style={{
                    fontSize: "4rem",
                    color: "var(--secondary-color)",
                  }}
                />
                <p>Empty Sales</p>
              </div>
            </>
          )}

          {/* <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent /> */}
        </div>
      </div>
    </>
  );
}

/**
 * The `RecentSaleTableContent` function is a React component that represents a single row of the recent sale table.
 * It displays the product image, name, count, and amount.
 * It returns a JSX element that contains the necessary HTML structure and data for rendering the table row.
 *
 * @function
 * @name RecentSaleTableContent
 * @kind function
 * @returns {React.JSX.Element}
 */
function RecentSaleTableContent({ name, price, count, id, currentBranch }) {
  const [productImg, setProductImg] = useState("");
  const { getProductImg } = useDatabase();

  useEffect(() => {
    getProductImg(id, currentBranch, setProductImg);
  }, []);

  return (
    <div className="home__recent_sale__table__content">
      <div>
        <img
          src={productImg == "" ? RemovedProductImg : productImg}
          alt=""
          className="p-5"
        />
      </div>
      <div>{name}</div>
      <div>{count}</div>
      <div>{price * count}</div>
    </div>
  );
}

/**
 * The `DateAndTime` function is a React component that displays the current date and time.
 * It uses the `useState` hook to store the current date and time as a state variable.
 * It also uses the `useEffect` hook to update the date and time every 10 seconds.
 * The component renders the formatted time and date in a div element.
 *
 * @function
 * @name DateAndTime
 * @returns {React.JSX.Element}
 */
function DateAndTime() {
  // Get the current date and time
  const [currentDateAndTime, setCurrentDateAndTime] = useState(new Date());

  // Extract the hours, minutes, and AM/PM period from the current date and time
  const hours = currentDateAndTime.getHours();
  const minutes = currentDateAndTime.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  // Format the time as "hh:mm AM/PM"
  const formattedTime = `${hours % 12 || 12}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  // Extract the year, month, and day from the current date and time
  const year = currentDateAndTime.getFullYear().toString().slice(-2);
  const month = (currentDateAndTime.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDateAndTime.getDate().toString().padStart(2, "0");

  // Define an array of days of the week and get the current day of the week
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = daysOfWeek[currentDateAndTime.getDay()];

  // useEffect hook to update the date and time every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateAndTime(new Date());
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="home__recent_sale__header__clock">
      <div className="home__recent_sale__header__clock__time">
        {formattedTime}
      </div>
      <div className="home__recent_sale__header__clock__date">
        {day}/{month}/{year} <span>{dayOfWeek}</span>
      </div>
    </div>
  );
}

/**
 * The `Upsale` function is a React component that represents the section of the home page displaying today's upsell products.
 * It returns a JSX element that contains the necessary HTML structure and data for rendering the upsell section.
 * It includes a heading, a table displaying the upsell products, and their sale counts.
 *
 * @function
 * @name Upsale
 * @kind function
 * @returns {React.JSX.Element}
 */
function Upsale({ data }) {
  const [upSaleList, setUpSaleList] = useState([]);

  useEffect(() => {
    let _upSaleList = {};
    console.log(data);
    data.forEach((p) => {
      if (p.name) {
        if (_upSaleList[p.name]) {
          _upSaleList[p.name] += p.count;
        } else {
          _upSaleList[p.name] = p.count;
        }
      }
    });

    const sortedArray = Object.entries(_upSaleList).sort(
      ([, a], [, b]) => a - b
    );
    sortedArray.reverse();
    console.log(sortedArray);
    setUpSaleList(sortedArray);
  }, [data]);
  useEffect(() => {
    console.log("upSaleList", upSaleList);
  }, [upSaleList]);

  return (
    <div className="home__upsale">
      <h3 className="home__upsale__heading">Today's Upsale</h3>
      {upSaleList.length >= 5 ? (
        <div className="home__upsale__table">
          <div className="home__upsale__table__content">
            <div>
              <img src={BestSellerImage} alt="" />
            </div>
            <div className="home__upsale__table__content__product_name">
              {upSaleList && upSaleList[0][0]}
            </div>
            <div className="home__upsale__table__content__sale_counts">
              {upSaleList && upSaleList[0][1]}
            </div>
          </div>
          <div className="home__upsale__table__content">
            <div>2</div>
            <div className="home__upsale__table__content__product_name">
              {upSaleList && upSaleList[1][0]}
            </div>
            <div className="home__upsale__table__content__sale_counts">
              {upSaleList && upSaleList[1][1]}
            </div>
          </div>
          <div className="home__upsale__table__content">
            <div>3</div>
            <div className="home__upsale__table__content__product_name">
              {upSaleList && upSaleList[2][0]}
            </div>
            <div className="home__upsale__table__content__sale_counts">
              {upSaleList && upSaleList[2][1]}
            </div>
          </div>
          <div className="home__upsale__table__content">
            <div>4</div>
            <div className="home__upsale__table__content__product_name">
              {upSaleList && upSaleList[3][0]}
            </div>
            <div className="home__upsale__table__content__sale_counts">
              {upSaleList && upSaleList[3][1]}
            </div>
          </div>
          <div className="home__upsale__table__content">
            <div>5</div>
            <div className="home__upsale__table__content__product_name">
              {upSaleList && upSaleList[4][0]}
            </div>
            <div className="home__upsale__table__content__sale_counts">
              {upSaleList && upSaleList[4][1]}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontWeight: "600",
            fontSize: ".9rem",
          }}
        >
          <InboxOutlined
            style={{
              fontSize: "4rem",
              color: "var(--secondary-color)",
            }}
          />
          <p>Products will be list soon</p>
        </div>
      )}
    </div>
  );
}

/**
 * The `OrderList` function is a React component that represents the section of the home page displaying the order list.
 * It returns a JSX element that contains the necessary HTML structure and data for rendering the order list section.
 * It includes a heading, a list of order items, and an "Add Order" button.
 *
 * @function
 * @name OrderList
 * @kind function
 * @returns {React.JSX.Element}
 */
function OrderList() {
  const { orders } = useDatabase();
  const { currentBranch } = useBranch();

  return (
    <>
      <div className="home__order_list">
        <h3 className="home__order_list__heading">Order List</h3>
        <div className="home__order_list__contents">
          {orders &&
            orders[currentBranch] &&
            orders[currentBranch].length > 0 &&
            orders[currentBranch].map((order, index) => (
              <OrderListContent
                key={index}
                {...{ order, index, currentBranch }}
              />
            ))}
        </div>
        <AddOrderButton />
      </div>
    </>
  );
}

/**
 * `AddOrderButton` represents a button component to add new orders with a modal window for input.
 *  allows users to open a modal window to input new order details.
 *
 * @function
 * @name AddOrderButton
 * @returns {React.JSX.Element}
 */
function AddOrderButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div
        className="home__order_list__add_order-btn"
        onClick={() => setIsModalOpen(true)}
      >
        <img src={PlusIcon} alt="" />
        Add Order
      </div>
      <OrderListInput {...{ isModalOpen, setIsModalOpen }} />
    </>
  );
}

/**
 * The function `OrderListInput` is a React component that takes two props: `isModalOpen` and `setIsModalOpen`.
 * The `isModalOpen` prop is used to determine whether a modal is currently open or not, and
 * the `setIsModalOpen` prop is used to update the state of the modal.
 *
 * @typedef {Object} FormValues
 * @property {string} product_name
 * @property {number} product_price
 * @property {number} service_phone
 * @property {number} customer_phone
 * @property {string} note
 *
 *
 * @function
 * @name OrderListInput
 * @param {Object} props - The props object
 * @param {boolean} props.isModalOpen - Indicates whether the modal is open or not.
 * @param {function} props.setIsModalOpen - A function to set the state of isModalOpen.
 *
 * @returns {JSX.Element} A JSX element representing the OrderListInput component.
 */
function OrderListInput({ isModalOpen, setIsModalOpen }) {
  // initialize the form instance.
  const [form] = Form.useForm();

  const { createOrder, orders } = useDatabase();
  const { currentBranch } = useBranch();

  // message API object, which is used to notify message.
  const [messageApi, contextHolder] = message.useMessage();

  // specifies the validation rules for the fields in a form.
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .min(9, "Phone number must be at least 10 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .matches(/^\+?[0-9]+$/, "Invalid phone number"),
  });

  /**
   * `phoneNumberValidator` is an asynchronous function that performs custom validation
   * for the `service phone` and `customer phone` fields.
   *
   * @async
   * @function
   * @memberof OrderListInput
   * @param {any} _
   * @param {FormValues} value
   * @returns {Promise<void>}
   */
  async function phoneNumberValidator(_, value) {
    {
      try {
        await validationSchema.validate({ phoneNumber: value });
      } catch (err) {
        throw new Error(err.message);
      }
    }
  }

  /**
   * Handle Model close
   *
   * @function
   * @memberof OrderListInput
   * @returns {void}
   */
  function handleOnCancel() {
    form.resetFields();
    setIsModalOpen(false);
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

  /**
   * Handle Form Submit
   *
   * @function
   * @memberof OrderListInput
   * @param {FormValues} values
   * @returns {void}
   */
  function handleOnSubmit(values) {
    console.log(values);
    if (orders[currentBranch]) {
      createOrder(
        [...orders[currentBranch], values].filter((x) => {
          if (x) return x;
        }),
        currentBranch
      );
    } else {
      createOrder([values], currentBranch);
    }
    form.resetFields(); // reset form
    setIsModalOpen(false); // close model
    playNotificationSound(); // play notification sound

    // added order notification message
    messageApi.open({
      type: "success",
      content: `${values.product_name} was added to order lsit`,
      duration: 3,
    });
  }

  return (
    <>
      {contextHolder}
      <Modal
        width="25%"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={handleOnCancel}
        className="modal"
        footer={null}
      >
        <h2>Add Order</h2>
        <Form
          className="home__order_list__input_form"
          initialValues={{
            remember: true,
          }}
          form={form}
          onFinish={handleOnSubmit}
        >
          <Form.Item
            name="product_name"
            rules={[
              {
                required: true,
                message: "Product name require!",
              },
            ]}
          >
            <Input
              className="form__input"
              placeholder="Product Name *"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="customer_name"
            rules={[
              {
                required: true,
                message: "Customer name require!",
              },
            ]}
          >
            <Input
              className="form__input"
              placeholder="Customer Name *"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="service_phone"
            rules={[
              {
                validator: phoneNumberValidator,
              },
            ]}
          >
            <Input
              className="form__input"
              placeholder="Service Phone* +959"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="customer_phone"
            rules={[
              {
                validator: phoneNumberValidator,
              },
            ]}
          >
            <Input
              className="form__input"
              placeholder="Customer Phone* +959"
              size="large"
            />
          </Form.Item>
          {/* <Form.Item name="note">
            <TextArea
              rows={4}
              className="form__input"
              placeholder="Note"
              maxLength={100}
            />
          </Form.Item> */}

          <Button
            type="primary"
            htmlType="submit"
            className="home__order_list__input_form__button"
          >
            Add
          </Button>
        </Form>
      </Modal>
    </>
  );
}

/**
 * The `OrderListContent` function is a React component that represents a single item in the order list.
 * It renders a div element with the item's number, name, price, checkbox and payment.
 * It also includes a state variable `isChecked` and a function `handleCheckboxChange` to handle the checkbox's checked state.
 *
 * @function
 * @name OrderListContent
 * @kind function
 * @returns {React.JSX.Element}
 */
function OrderListContent({ order, index, currentBranch }) {
  const [isChecked, setIsChecked] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { orders, createOrder, completeOrder } = useDatabase();

  return (
    <>
      <Modal
        width="25%"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        className="modal"
        footer={null}
      >
        <h3 className="font-sans text-base mb-8 font-bold">Order Details</h3>
        <div className="flex w-full h-32">
          <div className="font-sans text-base mr-4 w-1/2">
            <div className="mb-3">Product: </div>
            <div className="mb-3">Customer Name: </div>
            <div className="mb-3">Customer Phone: </div>
            <div className="mb-3">Service Phone: </div>
          </div>

          <div className="font-sans text-base w-1/2">
            <div className="mb-3">
              {order.product_name.length >= 20
                ? order.product_name.slice(0, 20) + ".."
                : order.product_name}
            </div>
            <div className="mb-3">
              {order.customer_name.length >= 20
                ? order.customer_name.slice(0, 20) + ".."
                : order.customer_name}
            </div>
            <div className="mb-3">{order.customer_phone}</div>
            <div className="mb-3">{order.service_phone}</div>
          </div>
        </div>
      </Modal>
      <div
        className={
          "cursor-pointer hover:bg-indigo-200/50 home__order_list__content" +
          (order.isArrived ? " home__order_list__content-checked" : "")
        }
      >
        <div className="ml-2 mr-5" onClick={() => setIsModalOpen(true)}>
          {order.product_name.length >= 20
            ? order.product_name.slice(0, 20) + ".."
            : order.product_name}
        </div>
        <div onClick={() => setIsModalOpen(true)}></div>
        <input
          type="checkbox"
          checked={order.isArrived}
          onChange={() => {
            orders[currentBranch][index].isArrived = !order.isArrived;
            console.log(orders);
            createOrder(orders[currentBranch], currentBranch);
          }}
        />
        <div
          onClick={() => {
            completeOrder(index, currentBranch);
          }}
        >
          done
        </div>
      </div>
    </>
  );
}

export default Home;
