import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { GetStaticProps, NextPage } from "next";
import { getCustomers } from "../api/customers";

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: "customer",
    headerName: "Customer",
    width: 150,
    editable: true,
  },
  {
    field: "description",
    headerName: "Description",
    type: "string",
    width: 400,
    editable: true,
  },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    width: 160,
    sortable: true,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export const getStaticProps: GetStaticProps = async () => {
  const data = await getCustomers();

  let orders: any = [];
  data.forEach((customer) => {
    if (customer.orders) {
      customer.orders.forEach((order) => {
        orders.push({
          ...order,
          customer: customer.name,
          id: order._id,
          price: Number(order.price.$numberDecimal),
        });
      });
    }
  });
  return {
    props: {
      orders: orders,
    },
    revalidate: 60,
  };
};

const Orders: NextPage = (props: any) => {
  console.log(props);
  return (
    <Container>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={props.orders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  );
};

export default Orders;
