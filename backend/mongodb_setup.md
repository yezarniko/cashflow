#### Create Root User

`use admin`

```javascript
db.createUser({
  user: "admin",
  pwd: "password",
  roles: ["root"],
});
```

#### Create Cash Flow User

`use cashflow`

```javascript
db.createUser({
  user: "cashflow_admin",
  pwd: "password",
  roles: [{ role: "readWrite", db: "cashflow" }],
});
```
