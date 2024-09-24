import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next";

type Customer = {
  id: number;
  name: string;
  industry: string;
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      customers: [
        {
          id: 1,
          name: "Eva Martin",
          industry: "Textiles",
        },
        {
          id: 2,
          name: "John victor",
          industry: "Business",
        },
      ] as Customer[],
    },
  };
};

const Customers: NextPage = ({
  customers,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(customers);
  return (
    <>
      <h1>Customers</h1>;
      {customers.map((customer: Customer) => {
        return (
          <div>
            <p>{customer.name}</p>
            <p>{customer.id}</p>
            <p>{customer.industry}</p>
          </div>
        );
      })}
    </>
  );
};

export default Customers;
