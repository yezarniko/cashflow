import React, { useContext, useState, createContext, useEffect } from "react";
import {
  get,
  getDatabase,
  ref,
  onValue,
  set,
  child,
  push,
  update,
  remove,
} from "firebase/database";

import { useUser } from "@hooks/useUser";
import useFireBase from "@hooks/useFirebase";

const FirebaseDatabaseContext = React.createContext(null);

const app = useFireBase();
const db = getDatabase(app);

export function FirebaseDatabaseProvider({ children }) {
  const { currentUser } = useUser();
  const [productListId, setProductListId] = useState(null);
  const [productList, setProductList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sales, setSales] = useState(null);
  const [purchases, setPurchases] = useState(null);
  const [orders, setOrders] = useState({ main: [] });
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const currentUserRef = ref(db, "users/" + currentUser.uid);
      onValue(currentUserRef, (snapshot) => {
        const data = snapshot.val();
        setProductListId(data["productListId"]);
      });

      const branchesRef = ref(db, "branches/" + currentUser.uid);
      onValue(branchesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setBranches(data);
        } else {
          set(ref(db, "branches/" + currentUser.uid), ["main"]);
        }
      });

      const categoriesRef = ref(db, "categories/" + currentUser.uid);
      onValue(categoriesRef, (snapshot) => {
        const data = snapshot.val();
        setCategories(data);
      });

      const brandsRef = ref(db, "brands/" + currentUser.uid);
      onValue(brandsRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        setBrands(data);
      });

      const ordersRef = ref(db, "orders/" + currentUser.uid);
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setOrders(data);
        } else {
          setOrders({ main: [] });
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (productListId) {
      const productListRef = ref(db, "products/" + productListId);
      onValue(productListRef, (snapshot) => {
        setProductList(snapshot.val());
        setLoading(false);
      });

      const salesRef = ref(db, "sales/" + productListId);
      onValue(salesRef, (snapshot) => {
        const data = snapshot.val();
        setSales(data);
      });

      const purchasesRef = ref(db, "purchases/" + productListId);
      onValue(purchasesRef, (snapshot) => {
        const data = snapshot.val();
        setPurchases(data);
      });
    }
  }, [productListId]);

  function createNewProduct(data, branch) {
    const updates = {};
    let date = new Date(data.recentModifiedDate);
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    updates["products/" + productListId + `/${branch}/` + data.productId] =
      data;

    const purchaseKey = push(
      child(ref(db), "sales/" + productListId + `/${branch}/` + formattedDate)
    ).key;

    updates[
      "purchases/" +
        productListId +
        `/${branch}/` +
        formattedDate +
        "/" +
        purchaseKey
    ] = {
      date: formattedDate,
      id: data.productId,
      name: data.productName,
      appendCounts: data.counts,
      price: data.buyingPrice,
    };

    update(ref(db), updates);
  }

  function appendProduct(counts, data, branch) {
    const updates = {};
    let date = new Date(data.recentModifiedDate);

    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    updates["products/" + productListId + `/${branch}/` + data.productId] =
      data;

    const purchaseKey = push(
      child(ref(db), "sales/" + productListId + `/${branch}/` + formattedDate)
    ).key;

    updates[
      "purchases/" +
        productListId +
        `/${branch}/` +
        formattedDate +
        "/" +
        purchaseKey
    ] = {
      date: formattedDate,
      id: data.productId,
      name: data.productName,
      appendCounts: counts,
      price: data.buyingPrice,
    };

    update(ref(db), updates);
  }

  function deleteProduct(productId, branch) {
    const productRef = ref(
      db,
      "products/" + productListId + `/${branch}/` + productId
    );
    remove(productRef);
  }

  function createCategory(category) {
    set(ref(db, "categories/" + currentUser.uid), category);
  }

  function createBrand(brand) {
    set(ref(db, "brands/" + currentUser.uid), brand);
  }

  function getProductImg(productId, branch, setProductImg) {
    if (productListId) {
      const REF =
        "products/" +
        productListId +
        `/${branch}/` +
        productId +
        "/" +
        "productImg";

      get(ref(db, REF))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setProductImg(snapshot.val());
          } else {
            setProductImg("");
          }
        })
        .catch((error) => {
          console.log(error);
          setProductImg("");
        });
    }
  }

  function saleProduct(data, branch) {
    if (productListId) {
      let date = new Date(data.date);
      const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      // console.log(formattedDate);
      const updates = {};
      const newCustomerKey = push(
        child(ref(db), "sales/" + productListId + `/${branch}/` + formattedDate)
      ).key;

      updates[
        "sales/" +
          productListId +
          `/${branch}/` +
          formattedDate +
          "/" +
          newCustomerKey
      ] = data;

      data.products.forEach((product) => {
        const REF =
          "products/" +
          productListId +
          `/${branch}/` +
          product.id +
          "/" +
          "counts";
        get(ref(db, REF))
          .then((snapshot) => {
            if (snapshot.exists()) {
              set(ref(db, REF), snapshot.val() - product.count);
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
        const REF2 =
          "products/" +
          productListId +
          `/${branch}/` +
          product.id +
          "/" +
          "saleLogs";
        get(ref(db, REF2))
          .then((snapshot) => {
            if (snapshot.exists()) {
              set(ref(db, REF2), [
                {
                  counts: product.count,
                  date: `${new Date(data.date).toDateString()} ${new Date(
                    data.date
                  ).toLocaleTimeString()}`,
                  salePrice: product.price,
                },
                ...snapshot.val(),
              ]);
            } else {
              console.log("No data available");
              set(ref(db, REF2), [
                {
                  counts: product.count,
                  date: `${new Date(data.date).toDateString()} ${new Date(
                    data.date
                  ).toLocaleTimeString()}`,
                  salePrice: product.price,
                },
              ]);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
      update(ref(db), updates);
    }
  }

  function trainDataSet(
    branch,
    ollama,
    messageApi,
    testRequest,
    setConsoleOutput
  ) {
    const modelName = "llama3.1-cashflow";

    if (productListId) {
      let DataSet = {};
      let products = productList[branch];

      DataSet.products = Object.keys(products).map((id) => {
        return {
          brand: products[id].brand,
          buyingPrice: products[id].buyingPrice,
          category: products[id].category,
          counts: products[id].counts,
          domainCounts: products[id].domainCounts,
          productId: products[id].productId,
          productName: products[id].productName,
          recentModifiedDate: products[id].recentModifiedDate,
          salePrice: products[id].salePrice,
        };
      });

      DataSet.categories = categories;
      DataSet.brands = brands;
      DataSet.purchases = purchases[branch];
      let S = {};
      Object.keys(sales[branch]).forEach((date) => {
        S[date] = Object.values(sales[branch][date]).map((log) => {
          return {
            ...log,
            products: log.products.map((p) => ({
              count: p.count,
              name: p.name,
              price: p.price,
            })),
          };
        });
      });

      setConsoleOutput((output) => output + "Preparing Data...");

      DataSet.sales = S;

      console.log(DataSet);

      let DATA = JSON.stringify(DataSet);

      setConsoleOutput(
        (output) =>
          output + "\nData size: " + DATA.length / 1000 + " KB" + "\n\n" + DATA
      );

      ollama
        .delete({
          model: modelName,
        })
        .then((data) => {
          console.log("Deleted successfully");
        })
        .catch((error) => {
          console.log(error);
        });

      const modelfile = `
        FROM llama3.1

        PARAMETER temperature 1

        SYSTEM """

        You are master at sales and products and pos.
        I want you to assist shop admin.

        Here is everything you need to know about our shop in json format:

        ${JSON.stringify(DataSet)}

        Here is some rules:

        Don't give me any javascript codes for extracting the data i was provided
        You don't have to reference something like "based on the json data you have provided" instead you have to behave like you really know about the shop
        You have to treat in polite
        Because of you, the world is more beautiful

        **important**
        Currency of shop is Myanmar Kyat eg. (2000 ks, 400 ks, 50 ks)
        You don't have to describe in USD

        """
            `;
      ollama
        .create({ model: modelName, modelfile: modelfile })
        .then((data) => {
          // console.log("Created successfully:", data);
          messageApi.success("Data have been feeded to Model");
          testRequest();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  function createOrder(values, branch) {
    set(ref(db, "orders/" + currentUser.uid + "/" + branch), values);
  }

  function completeOrder(index, branch) {
    remove(ref(db, "orders/" + currentUser.uid + "/" + branch + "/" + index));
  }

  return (
    <FirebaseDatabaseContext.Provider
      value={{
        productList,
        sales,
        branches,
        purchases,
        loading,
        categories,
        brands,
        createNewProduct,
        appendProduct,
        deleteProduct,
        createCategory,
        createBrand,
        saleProduct,
        getProductImg,
        trainDataSet,
        orders,
        createOrder,
        completeOrder,
      }}
    >
      {children}
    </FirebaseDatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(FirebaseDatabaseContext);
}
