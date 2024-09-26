import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Customer } from "./index";
//Error : Import 'Customer' conflicts with local value, so must be declared with a type-only import when 'isolatedModules' is enabled.
//Renamed last default export to CustomerPage to fix this
//import axios, { AxiosError } from "axios";
import { ParsedUrlQuery } from "querystring";
//import clientPromise from "../../lib/mongodb";
//import { ObjectId } from "mongodb";
import { BSONError } from "bson";
import { getCustomer } from "../api/customers/[id]";

type Props = {
  customer?: Customer;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  //   const result = await axios.get("http://localhost:8000/api/customers/");
  //   const paths = result.data.customers.map((customer: Customer) => {
  //     return {
  //       params: { id: customer.id.toString() },
  //     };
  //   });

  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const params = context.params!;

  try {
    const data = await getCustomer(params.id);

    console.log("!!!", data);

    if (!data) {
      return {
        notFound: true,
        revalidate: 60,
      };
    }

    return {
      props: {
        customer: JSON.parse(JSON.stringify(data)),
      },
      revalidate: 60,
    };
  } catch (err) {
    console.log(err);
    if (BSONError) {
      return {
        notFound: true,
      };
    }
    throw err;
  }
};

const CustomerPage: NextPage<Props> = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Loading..</p>;
  }

  return <h1>{props.customer ? "Customer " + props.customer.name : null}</h1>;
};

export default CustomerPage;
