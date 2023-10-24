const { projects, clients, users, userAuths } = require("../sampleData");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
} = require("graphql");
const { GraphQLDateTime, GraphQLPhoneNumber } = require("graphql-scalars");

const User = require("../models/User");
const UserAuth = require("../models/UserAuth");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

const ProductLogType = new GraphQLObjectType({
  name: "ProductLog",
  fields: () => ({
    date: { type: GraphQLDateTime },
    counts: { type: GraphQLInt },
    buyingPrice: { type: GraphQLInt },
    amount: { type: GraphQLInt },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "category",
  fields: () => ({
    name: { type: GraphQLString },
  }),
});

const BrandType = new GraphQLObjectType({
  name: "brand",
  fields: () => ({
    name: { type: GraphQLString },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    productId: { type: GraphQLString },
    productName: { type: GraphQLString },
    productImg: { type: GraphQLString },
    category: {
      type: GraphQLString,
    },
    brand: { type: GraphQLString },
    buyingPrice: { type: GraphQLInt },
    salePrice: { type: GraphQLInt },
    domainCounts: { type: GraphQLInt },
    counts: { type: GraphQLInt },
    recentModifiedDate: { type: GraphQLDateTime },
    productLogs: {
      type: GraphQLList(ProductLogType),
      // resolve: async (parent, args) => {
      //   const user = await User.findOne({
      //     userId: args.userId,
      //   }).exec();
      //   if (user) {
      //     productList = user.branches.find(
      //       (b) => b.branchId == args.branchId
      //     ).productList;
      //     return productList.find((pl) => pl.productLogs);
      //   }
      // },
    },
  }),
});

const ProductInputType = new GraphQLInputObjectType({
  name: "ProductInput",
  fields: () => ({
    productId: { type: GraphQLString },
    productName: { type: GraphQLString },
    productImg: { type: GraphQLString },
    category: {
      type: GraphQLString,
    },
    brand: { type: GraphQLString },
    salePrice: { type: GraphQLInt },
    counts: { type: GraphQLInt },
  }),
});

const SaleLogType = new GraphQLObjectType({
  name: "SaleLog",
  fields: () => ({
    customer_id: { type: GraphQLInt },
    amount: { type: GraphQLInt },
    timestamp: { type: GraphQLDateTime },
    isOrder: { type: GraphQLBoolean },
    // products: { type: GraphQLList(ProductInputType) },
  }),
});

const SaleLogInputType = new GraphQLInputObjectType({
  name: "SaleLogInput",
  fields: () => ({
    customer_id: { type: GraphQLInt },
    amount: { type: GraphQLInt },
    // timestamp: { type: GraphQLDateTime },
    isOrder: { type: GraphQLBoolean },
    // products: { type: GraphQLList(ProductType) },
  }),
});

const InputLogType = new GraphQLObjectType({
  name: "InputLog",
  fields: () => ({
    amount: { type: GraphQLInt },
    date: { type: GraphQLDateTime },
    products: { type: GraphQLList(ProductType) },
  }),
});

const BranchType = new GraphQLObjectType({
  name: "Branch",
  fields: () => ({
    name: { type: GraphQLString },
    branchId: { type: GraphQLString },

    phone: {
      type: GraphQLPhoneNumber,
    },
    address: {
      type: GraphQLString,
    },
    agentName: {
      type: GraphQLString,
    },
    productsList: { type: GraphQLList(ProductType) },
    saleLogs: { type: GraphQLList(SaleLogType) },
    inputLogs: { type: GraphQLList(InputLogType) },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    userId: { type: GraphQLString },
    branches: {
      type: new GraphQLList(BranchType),
      resolve: async (parent, args) => {
        const currentUser = await User.findOne({
          userId: parent.userId,
        }).exec();
        if (currentUser) {
          return currentUser.branches;
        }
      },
    },
  }),
});

const CashListInputType = new GraphQLInputObjectType({
  name: "CashListInput",
  fields: () => ({
    count: { type: GraphQLInt },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
  }),
});

const RecentSaleLogsType = new GraphQLObjectType({
  name: "CashList",
  fields: () => ({
    productImg: { type: GraphQLString },
    count: { type: GraphQLInt },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
  }),
});

// const CashListType =

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: {
        userId: { type: GraphQLString },
        token: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        try {
          const currentUserAuth = await UserAuth.findOne({
            userId: args.userId,
            accountToken: args.token,
          }).exec();

          if (currentUserAuth) {
            const user = await User.findOne({ userId: currentUserAuth.userId });
            return user;
          } else {
            return null;
          }
        } catch (error) {
          throw new Error("Error in user query: " + error.message);
        }
      },
    },
    recentSaleLogs: {
      type: GraphQLList(RecentSaleLogsType),
      args: {
        userId: { type: GraphQLString },
        token: { type: GraphQLString },
        branchId: { type: GraphQLNonNull(GraphQLString) },
        branchToken: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const currentUserAuth = await UserAuth.findOne({
            userId: args.userId,
            accountToken: args.token,
          }).exec();

          if (currentUserAuth) {
            const user = await User.findOne({ userId: currentUserAuth.userId });

            const branch_auths = currentUserAuth.branches.find(
              (b) =>
                b.branchId == args.branchId && b.branchToken == args.branchToken
            );

            if (!branch_auths) throw new Error("Unauthorized Branch");

            const saleLogs = user.branches.find(
              (b) => b.branchId == args.branchId
            ).saleLogs;

            const productList = user.branches.find(
              (b) => b.branchId == args.branchId
            ).productList;

            let a = [];

            saleLogs.forEach((s) => {
              s.products.forEach((p) => {
                const todayDate = new Date().toLocaleDateString();
                const saleDate = s.timestamp.toLocaleDateString();
                if (todayDate == saleDate) {
                  a.push(p);
                }
              });
            });
            a = a.map((p) => {
              const prod = productList.find((pd) => pd.productName == p.name);
              img = prod ? prod.productImg : "";
              return {
                name: p.name,
                price: p.price,
                count: p.count,
                productImg: img,
              };
            });
            a.reverse();
            return a;
          } else {
            return null;
          }
        } catch (error) {
          throw new Error("Error in user query: " + error.message);
        }
      },
    },
    products: {
      type: GraphQLList(ProductType),
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        token: { type: GraphQLNonNull(GraphQLString) },
        branchId: { type: GraphQLNonNull(GraphQLString) },
        branchToken: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const currentUserAuth = await UserAuth.findOne({
            userId: args.userId,
            accountToken: args.token,
          }).exec();

          if (currentUserAuth) {
            const user = await User.findOne({ userId: currentUserAuth.userId });

            const branch_auths = currentUserAuth.branches.find(
              (b) =>
                b.branchId == args.branchId && b.branchToken == args.branchToken
            );

            if (!branch_auths) throw new Error("Unauthorized Branch");

            return user.branches.find((b) => b.branchId == args.branchId)
              .productList;
          } else {
            return null;
          }
        } catch (error) {
          throw new Error("Error in user query: " + error.message);
        }
      },
    },
    categories: {
      type: GraphQLList(CategoryType),
      resolve: async (parent, args) => {
        const categories = await Category.find();
        return categories;
      },
    },
    brands: {
      type: GraphQLList(BrandType),
      resolve: async (parent, args) => {
        const brands = await Brand.find();
        return brands;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        accountToken: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          // Create a random branchId
          // const randomBranchId = Math.floor(Math.random() * 100000000000);
          const randomBranchId = `${97642144875}`;
          const randomBranchToken = `${20746829937}`;

          // Create a default branch with name "main" and the random branchId
          const defaultBranch = {
            name: "Main",
            branchId: randomBranchId.toString(),
          };

          const existingUser = await User.findOne({
            userId: args.userId,
          }).exec();

          if (existingUser) {
            const currentUserAuth = await UserAuth.findOne({
              userId: existingUser.userId,
            });

            if (currentUserAuth.accountToken != args.accountToken) {
              currentUserAuth.accountToken = args.accountToken;
              await currentUserAuth.save();
            }
            return null;
          }

          const newUser = new User({
            userId: args.userId,
            branches: [defaultBranch], // Assign the default branch to the user's branches field
          });

          const newUserAuth = new UserAuth({
            userId: args.userId,
            accountToken: args.accountToken,
            branches: [
              { branchId: randomBranchId, branchToken: randomBranchToken },
            ],
          });

          const savedUser = await newUser.save();
          await newUserAuth.save();
          return savedUser;

          // Create the user with the default branch
        } catch (error) {
          throw new Error("Error creating user: " + error.message);
        }
      },
    },
    addProduct: {
      type: GraphQLList(ProductType),
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        accountToken: { type: GraphQLNonNull(GraphQLString) },
        branchId: { type: GraphQLNonNull(GraphQLString) },
        branchToken: { type: GraphQLNonNull(GraphQLString) },

        productId: { type: GraphQLNonNull(GraphQLString) },
        productName: { type: GraphQLNonNull(GraphQLString) },
        productImg: { type: GraphQLString },
        category: { type: GraphQLString },
        brand: { type: GraphQLString },
        buyingPrice: { type: GraphQLNonNull(GraphQLInt) },
        salePrice: { type: GraphQLNonNull(GraphQLInt) },
        domainCounts: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args) => {
        try {
          const user_auths = await UserAuth.findOne({
            userId: args.userId,
            accountToken: args.accountToken,
          });

          if (!user_auths) {
            throw new Error("Unauthorized User");
          }

          const branch_auths = user_auths.branches.find(
            (b) =>
              b.branchId == args.branchId && b.branchToken == args.branchToken
          );

          if (!branch_auths) {
            throw new Error("Unauthorized Branch");
            // return null;
          }

          const user = await User.findOne({ userId: args.userId });
          const branch = user.branches.find((b) => b.branchId == args.branchId);

          const category = await Category.findOne({ name: args.category });
          const brand = await Brand.findOne({ name: args.brand });

          if (branch.productList) {
            const existingProduct = branch.productList.find(
              (product) => product.productId == args.productId
            );

            if (existingProduct) {
              return null;
            }
          }

          const newProduct = {
            productId: args.productId,
            productName: args.productName,
            productImg: args.productImg
              ? args.productImg
              : "https://firebasestorage.googleapis.com/v0/b/cashflow-ab32b.appspot.com/o/images%2Fthumbnail.png?alt=media&token=e8043bd8-ce43-4b75-8fc6-27de5ef7dde3",
            category: category ? category.name : "",
            brand: brand ? brand.name : "",
            buyingPrice: args.buyingPrice,
            salePrice: args.salePrice,
            domainCounts: args.domainCounts,
            counts: args.domainCounts,
            recentModifiedDate: new Date(),
            productLogs: [
              {
                date: new Date(),
                counts: args.domainCounts,
                buyingPrice: args.buyingPrice,
                amount: args.domainCounts * args.buyingPrice,
              },
            ],
          };
          branch.productList.push(newProduct);
          user.branches = user.branches
            .filter((b) => b.branchId != args.branchId)
            .concat(branch);
          await user.save();
          return user.branches.find((b) => b.branchId == args.branchId)
            .productList;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    appendProduct: {
      type: ProductType,
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        accountToken: { type: GraphQLNonNull(GraphQLString) },
        branchId: { type: GraphQLNonNull(GraphQLString) },
        branchToken: { type: GraphQLNonNull(GraphQLString) },

        productId: { type: GraphQLNonNull(GraphQLString) },
        buyingPrice: { type: GraphQLInt },
        salePrice: { type: GraphQLInt },
        counts: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args) => {
        try {
          const user_auths = await UserAuth.findOne({
            userId: args.userId,
            accountToken: args.accountToken,
          });

          if (!user_auths) {
            throw new Error("Unauthorized User");
          }

          const branch_auths = user_auths.branches.find(
            (b) =>
              b.branchId == args.branchId && b.branchToken == args.branchToken
          );

          if (!branch_auths) {
            throw new Error("Unauthorized Branch");
            // return null;
          }

          const user = await User.findOne({ userId: args.userId });
          const branch = user.branches.find((b) => b.branchId == args.branchId);

          let currentProduct = branch.productList.find(
            (p) => p.productId == args.productId
          );

          currentProduct.domainCounts = args.counts + currentProduct.counts;
          currentProduct.counts += args.counts;

          if (args.buyingPrice) {
            currentProduct.buyingPrice = args.buyingPrice;
          }

          if (args.salePrice) {
            currentProduct.salePrice = args.salePrice;
          }

          currentProduct.productLogs.push({
            date: new Date(),
            counts: args.counts,
            buyingPrice: currentProduct.buyingPrice,
            amount: args.counts * currentProduct.buyingPrice,
          });

          branch.productList = branch.productList
            .filter((p) => p.productId != args.productId)
            .concat(currentProduct);
          user.branches = user.branches
            .filter((b) => b.branchId != args.branchId)
            .concat(branch);
          await user.save();
          return user.branches
            .find((b) => b.branchId == args.branchId)
            .productList.find((p) => p.productId == args.productId);
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    saleProduct: {
      type: GraphQLList(ProductType),
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        accountToken: { type: GraphQLNonNull(GraphQLString) },
        branchId: { type: GraphQLNonNull(GraphQLString) },
        branchToken: { type: GraphQLNonNull(GraphQLString) },
        cashList: {
          type: GraphQLList(CashListInputType),
        },
      },
      resolve: async (parent, args) => {
        try {
          const user_auths = await UserAuth.findOne({
            userId: args.userId,
            accountToken: args.accountToken,
          });

          if (!user_auths) {
            throw new Error("Unauthorized User");
          }

          const branch_auths = user_auths.branches.find(
            (b) =>
              b.branchId == args.branchId && b.branchToken == args.branchToken
          );

          if (!branch_auths) {
            throw new Error("Unauthorized Branch");
            // return null;
          }

          const user = await User.findOne({ userId: args.userId });
          const branch = user.branches.find((b) => b.branchId == args.branchId);

          if (branch.productList) {
            args.cashList.forEach((cashProduct) => {
              const currentProduct = branch.productList.find(
                (product) => product.productName == cashProduct.name
              );

              if (!currentProduct) {
                return null;
              }

              branch.productList = branch.productList
                .filter((product) => product.productName != cashProduct.name)
                .concat({
                  ...currentProduct,
                  counts: currentProduct.counts - cashProduct.count,
                });
            });

            user.branches = user.branches
              .filter((b) => b.branchId != args.branchId)
              .concat(branch);
            await user.save();
            return user.branches.find((b) => b.branchId == args.branchId)
              .productList;
          } else {
            throw new Error("Auth Error!");
          }
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    addSaleLog: {
      type: GraphQLList(ProductType),
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        accountToken: { type: GraphQLNonNull(GraphQLString) },
        branchId: { type: GraphQLNonNull(GraphQLString) },
        branchToken: { type: GraphQLNonNull(GraphQLString) },

        saleLog: { type: SaleLogInputType },
        products: { type: GraphQLList(CashListInputType) },
      },
      resolve: async (parent, args) => {
        try {
          const user_auths = await UserAuth.findOne({
            userId: args.userId,
            accountToken: args.accountToken,
          });

          if (!user_auths) {
            throw new Error("Unauthorized User");
          }

          const branch_auths = user_auths.branches.find(
            (b) =>
              b.branchId == args.branchId && b.branchToken == args.branchToken
          );

          if (!branch_auths) {
            throw new Error("Unauthorized Branch");
            // return null;
          }

          const user = await User.findOne({ userId: args.userId });
          const branch = user.branches.find((b) => b.branchId == args.branchId);

          let SALELOG = args.saleLog;
          console.log(SALELOG);
          SALELOG = {
            ...SALELOG,
            timestamp: new Date(),
          };
          // SALELOG.products = Object.values(args.products);
          console.log(SALELOG);
          branch.saleLogs.push({ ...SALELOG, products: [...args.products] });

          user.branches = user.branches
            .filter((b) => b.branchId != args.branchId)
            .concat(branch);
          await user.save();
          return user.branches.find((b) => b.branchId == args.branchId)
            .productList;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    deleteProduct: {
      type: GraphQLList(ProductType),
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        accountToken: { type: GraphQLNonNull(GraphQLString) },
        branchId: { type: GraphQLNonNull(GraphQLString) },
        branchToken: { type: GraphQLNonNull(GraphQLString) },
        productId: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const user_auths = await UserAuth.findOne({
            userId: args.userId,
            accountToken: args.accountToken,
          });

          if (!user_auths) {
            throw new Error("Unauthorized User");
          }

          const branch_auths = user_auths.branches.find(
            (b) =>
              b.branchId == args.branchId && b.branchToken == args.branchToken
          );

          if (!branch_auths) {
            throw new Error("Unauthorized Branch");
            // return null;
          }

          let user = await User.findOne({ userId: args.userId });
          let branch = user.branches.find((b) => b.branchId == args.branchId);

          branch.productList = branch.productList.filter(
            (p) => p.productId != args.productId
          );

          user.branches = user.branches
            .filter((b) => b.branchId != args.branchId)
            .concat(branch);
          await user.save();
          return user.branches.find((b) => b.branchId == args.branchId)
            .productList;
        } catch (error) {}
      },
    },
    addCategory: {
      type: CategoryType,
      args: {
        categoryName: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const newCategory = new Category({
            name: args.categoryName,
          });
          const savedCategory = await newCategory.save();
          return savedCategory;
        } catch (error) {
          throw new Error("Error creating category: " + error.message);
        }
      },
    },
    addBrand: {
      type: CategoryType,
      args: {
        brandName: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const newBrand = new Brand({
            name: args.brandName,
          });
          const savedBrand = await newBrand.save();
          return savedBrand;
        } catch (error) {
          throw new Error("Error creating brand: " + error.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
