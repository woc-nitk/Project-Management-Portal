import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { getCookie } from "./cookieFunctions";
import { CookiesProvider } from "react-cookie";

const client = new ApolloClient({
  uri: "https://woc-demo-portal.herokuapp.com/",
  request: (operation) => {
    const refreshToken = getCookie("refresh");
    const accessToken = getCookie("access");
    operation.setContext({
      headers: {
        auth: accessToken ? `${accessToken}` : "",
        refresh: refreshToken ? `${refreshToken}` : "",
      },
    });
  },
});

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
