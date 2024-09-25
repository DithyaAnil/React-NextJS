import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Customer } from "./index";
//Error : Import 'Customer' conflicts with local value, so must be declared with a type-only import when 'isolatedModules' is enabled.
//Rename last default export to fix this
import axios, { AxiosError } from "axios";
import { ParsedUrlQuery } from "querystring";
//import { notFound } from "next/navigation";

type Props = {
  customer?: Customer;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await axios.get("http://localhost:8000/api/customers/");
  const paths = result.data.customers.map((customer: Customer) => {
    return {
      params: { id: customer.id.toString() },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const params = context.params!;
  try {
    const result = await axios.get<{ customer: Customer }>(
      `http://localhost:8000/api/customers/${params.id}`
    );
    return {
      props: {
        customer: result.data.customer,
      },
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 404) {
        return {
          notFound: true,
        };
      }
    }
    return {
      props: {},
    };
  }
};

const CustomerPage: NextPage<Props> = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Loading...</p>;
  }
  return <h1>Customer {props.customer ? props.customer.name : null}</h1>;
};

export default CustomerPage;
