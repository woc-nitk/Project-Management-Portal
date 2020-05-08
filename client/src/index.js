import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { getCookie } from "./cookieFunctions";

const client = new ApolloClient({
  uri: "http://localhost:4000",
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
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
