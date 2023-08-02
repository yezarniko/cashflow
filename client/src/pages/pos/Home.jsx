// @ts-check
// React imports
import React, { useEffect, useRef, useState } from "react";

// Asset imports
import FlagImg from "@assets/Flag_of_Myanmar.svg"; // Importing the flag image of Myanmar
import PlusIcon from "@assets/add.png"; // Importing the 'add' icon image
import BestSellerImage from "@assets/bestseller.png"; // Importing the bestseller image
import ProductImg from "@assets/herballines-shampoo.png"; // Importing the product image for 'Herballines Shampoo'

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
  return (
    <div className="home">
      <RecentSaleDash />
      <Upsale />
      <OrderList />
    </div>
  );
}

/**
 * The `RecentSaleDash` function is a React component that represents the recent sale dashboard section of the home page.
 *
 * @function
 * @name RecentSaleDash
 * @kind function
 * @returns {React.JSX.Element}
 */
function RecentSaleDash() {
  useEffect(() => {
    console.log("render Recent Sale!");
  });

  return (
    <div className="home__recent_sale">
      <div className="home__recent_sale__header">
        <div className="home__recent_sale__header__total_sale">
          Today Sale : <span>2000000</span>
          <span>
            ks
            <img src={FlagImg} />
          </span>
        </div>
        <DateAndTime />
      </div>
      <RecentSaleTable />
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
function RecentSaleTable() {
  // Create a reference to the table element using the useRef hook
  const tableRef = useRef(null);

  // useEffect hook to set the position of the table based on the window height
  useEffect(() => {
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
  }, []);

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
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
          <RecentSaleTableContent />
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
function RecentSaleTableContent() {
  return (
    <div className="home__recent_sale__table__content">
      <div>
        <img src={ProductImg} alt="" />
      </div>
      <div>Herbaline Shampoo</div>
      <div>1</div>
      <div>12000</div>
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
 * @kind function
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
function Upsale() {
  return (
    <div className="home__upsale">
      <h3 className="home__upsale__heading">Today's Upsale</h3>
      <div className="home__upsale__table">
        <div className="home__upsale__table__content">
          <div>
            <img src={BestSellerImage} alt="" />
          </div>
          <div className="home__upsale__table__content__product_name">Eggs</div>
          <div className="home__upsale__table__content__sale_counts">50</div>
        </div>
        <div className="home__upsale__table__content">
          <div>2</div>
          <div className="home__upsale__table__content__product_name">
            Coca-cola
          </div>
          <div className="home__upsale__table__content__sale_counts">30</div>
        </div>
        <div className="home__upsale__table__content">
          <div>3</div>
          <div className="home__upsale__table__content__product_name">
            Ubrand Book
          </div>
          <div className="home__upsale__table__content__sale_counts">25</div>
        </div>
        <div className="home__upsale__table__content">
          <div>4</div>
          <div className="home__upsale__table__content__product_name">
            Ovaltine
          </div>
          <div className="home__upsale__table__content__sale_counts">24</div>
        </div>
        <div className="home__upsale__table__content">
          <div>5</div>
          <div className="home__upsale__table__content__product_name">
            Mama noodle
          </div>
          <div className="home__upsale__table__content__sale_counts">20</div>
        </div>
      </div>
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
  return (
    <>
      <div className="home__order_list">
        <h3 className="home__order_list__heading">Order List</h3>
        <div className="home__order_list__contents">
          <OrderListContent />
          <OrderListContent />
          <OrderListContent />
          <OrderListContent />
          <OrderListContent />
          <OrderListContent />
          <OrderListContent />
          <OrderListContent />
          <OrderListContent />
          <OrderListContent />
        </div>
        <div className="home__order_list__add_order-btn">
          <img src={PlusIcon} alt="" />
          Add Order
        </div>
      </div>
    </>
  );
}

function OrderListInput() {
  return (
    <div className="home__order_list__input_box">
      <h3 className="home__order_list__heading">Add Order</h3>
      <div className="home__order_list__form">
        <input type="text" className="home__order_list__form__product_name" />
        <input type="text" className="home__order_list__form__product_price" />
        <input type="text" className="home__order_list__form__service_phone" />
        <input type="text" className="home__order_list__form__customer_phone" />
        <input type="textarea" className="home__order_list__form__note" />
      </div>
    </div>
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
function OrderListContent() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div
      className={
        "home__order_list__content " +
        (isChecked ? "home__order_list__content-checked" : "")
      }
    >
      <div>1</div>
      <div>LG TV</div>
      <div>200k</div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <div>cash</div>
    </div>
  );
}

export default Home;
