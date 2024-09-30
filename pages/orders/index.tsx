import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { GetStaticProps, NextPage } from "next";
import { getCustomers } from "../api/customers";
import { useRouter } from "next/router";
import { ObjectId } from "mongodb";
import { Customer } from "../customers";
import { Order } from "../customers";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Order ID",
    width: 100,
  },
  {
    field: "customerId",
    headerName: "Customer ID",
    width: 100,
  },
  {
    field: "customerName",
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
    field: "orderPrice",
    headerName: "Price",
    type: "number",
    width: 160,
    sortable: true,
  },
];

interface OrderRow extends Order {
  orderPrice: number;
  customerName: string;
  customerId?: ObjectId;
  id: ObjectId;
}

type Props = {
  orders: Order[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getCustomers();

  const orders: OrderRow[] = [];

  data.forEach((customer: Customer) => {
    if (customer.orders) {
      customer.orders.forEach((order: Order) => {
        orders.push({
          ...order,
          customerName: customer.name,
          customerId: customer._id,
          id: order._id,
          orderPrice: Number(order.price.$numberDecimal),
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

const Orders: NextPage<Props> = (props) => {
  const { customerId } = useRouter().query;
  console.log(customerId);
  return (
    <Container>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          filterModel={{
            items: [
              {
                field: "customerId",
                operator: "equals",
                value: customerId,
              },
            ],
          }}
          rows={props.orders}
          columns={columns}
          initialState={{
            filter: {
              filterModel: {
                items: [
                  {
                    field: "customerId",
                    operator: "equals",
                    value: customerId,
                  },
                ],
              },
            },

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
