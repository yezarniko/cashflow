// @ts-check
// React imports
import React, { useContext, useEffect, useState } from "react";

// Asset imports
import HomeLogo from "@assets/Home.png"; // Importing the home logo image
import Logo from "@assets/Logo.png"; // Importing the logo image
import LogsLogo from "@assets/Logs.png"; // Importing the logs logo image
import ProductsLogo from "@assets/Products.png"; // Importing the products logo image
import SaleLogo from "@assets/Sale.png"; // Importing the sale logo image
import SettingsLogo from "@assets/Settings.png"; // Importing the settings logo image
import StatisticsLogo from "@assets/Statistics.png"; // Importing the statistics logo image
import ProfileImg from "@assets/profile.jpg"; // Importing the profile image

/**
 * The `Sidebar` function is a React component that renders the sidebar.
 * The sidebar consists of a logo, a menu, and an account profile section.
 *
 * @function
 * @name Sidebar
 * @kind function
 * @returns {React.JSX.Element}
 */
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={Logo} />
      </div>
      <Menu />
      <div className="sidebar__account_profile">
        <img
          src={ProfileImg}
          alt=""
          className="sidebar__account_profile__img"
        />
        <p className="sidebar__account_profile__name">Admin</p>
        <div className="sidebar__settings">
          <img src={SettingsLogo} alt="" className="sidebar__settings__logo" />
          <div className="sidebar__settings__text">Settings</div>
        </div>
      </div>
    </div>
  );
}

/**
 * This context object can be used to share data between components without passing props manually through every level of the component tree.
 * The `createContext()` function returns an object with two properties: `Provider` and `Consumer`.
 * The `Provider` component is used to provide the context value to its descendants, and the `Consumer` component is used to access the context value within a component.
 *
 * @constant
 * @name CurrentPageContext
 * @kind variable
 * @type {React.Context<any>}
 */
const CurrentPageContext = React.createContext(null);

/**
 * The `Menu` function is a React component that renders the menu section of the sidebar.
 * It returns a JSX element that represents the menu.
 * The menu consists of a list of menu items, each containing a logo and text.
 * The current page is tracked using the `currentPage` state variable and updated using the `setCurrentPage` function from the `CurrentPageContext` context.
 *
 * @function
 * @name Menu
 * @kind function
 * @returns {React.JSX.Element}
 */
function Menu() {

  const [currentPage, setCurrentPage] = useState("Home");

  useEffect(() => {
    console.log("Render Menu!");
  });

  return (
    /**
     * It creates a context provider with the value of `currentPage` and `setCurrentPage` as an object.
     * This allows any component that consumes the `CurrentPageContext` to access and update the `currentPage` state variable and `setCurrentPage` function.
     *
     * @constant
     * @name CurrentPageContext
     * @type {React.Context<any>}
     */
    <CurrentPageContext.Provider value={{ currentPage, setCurrentPage }}>
      <ul className="sidebar__menu">
        <MenuItem Logo={HomeLogo} text="Home" />
        <MenuItem Logo={SaleLogo} text="Sale" />
        <MenuItem Logo={ProductsLogo} text="Products" />
        <MenuItem Logo={LogsLogo} text="Logs" />
        <MenuItem Logo={StatisticsLogo} text="Statistics" />
      </ul>
    </CurrentPageContext.Provider>
  );
}

/**
 * The `function MenuItem({ Logo, text })` is a component that takes in two props, `Logo` and `text`.
 * These props are destructured from the component's parameter object.
 * The component renders a menu item in the sidebar with an image logo and text.
 * The `Logo` prop represents the logo image for the menu item, and the `text` prop represents the text for the menu item.
 *
 * @function
 * @name MenuItem
 * @kind function
 * @param {Object} props - The component props.
 * @param {string} props.Logo - The URL of the logo image for the menu item.
 * @param {string} props.text - The text for the menu item.
 *
 * @returns {React.JSX.Element}
 */
function MenuItem({ Logo, text }) {
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext);

  return (
    <li
      className={
        "sidebar__menu__item " +
        (currentPage == text ? "sidebar__menu__item-selected" : "")
      }
      onClick={() => setCurrentPage(text)}
    >
      <img src={Logo} alt="" className="sidebar__menu__item__logo" />
      <div className="sidebar__menu__item__text">{text}</div>
    </li>
  );
}

export default Sidebar;
