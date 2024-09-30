import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { ObjectId } from "mongodb";
import { getCustomers } from "../api/customers";
import { useQuery } from "@tanstack/react-query";
import CustomerComponent from "../../components/Customer";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

export type Order = {
  description: string;
  price: { numberDecimal: string };
  _id: ObjectId;
};

export type Customer = {
  _id?: ObjectId;
  name: string;
  industry: string;
  orders?: Order[];
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await getCustomers();

  console.log("!!!", data);

  //   const result = await axios.get<{
  //     customers: Customer[];
  //   }>("http://localhost:8000/api/customers/");
  //   console.log(result.data.customers);

  return {
    props: {
      customers: data,
    },
    revalidate: 60,
  };
};

const Customers: NextPage = ({
  customers: c,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: { data: { customers = c } = {} } = {} } = useQuery({
    queryKey: ["customers"],
    queryFn: () => {
      return axios("/api/customers");
    },
  });

  console.log(c, customers);

  return (
    <Container>
      <Grid container spacing={5} sx={{ mt: 1 }}>
        {customers.map((customer: Customer) => {
          return (
            <CustomerComponent
              key={customer._id?.toString()}
              customer={customer}
            />
          );
        })}
      </Grid>
    </Container>
  );
};

export default Customers;
