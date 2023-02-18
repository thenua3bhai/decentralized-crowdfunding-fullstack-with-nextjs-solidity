import React, { Component } from "react";
import { Button, Table, Label, Header } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import web3 from "../../../etheriumSide/web3";
import Campaign from "../../../etheriumSide/build/Campaign.json";
import RenderRow from "../../../components/RenderRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const instance = await new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      props.query.address
    );

    const requestsCount = await instance.methods.getRequestsCount().call();
    const approversCount = await instance.methods.approversCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return instance.methods.requests(index).call();
        })
    );
    console.log(requests);
    return {
      address: props.query.address,
      requestsCount: requestsCount,
      requests: requests,
      approversCount: approversCount,
    };
  }
  renderRows() {
    return this.props.requests.map((element, index) => {
      return (
        <RenderRow
          key={index}
          id={index}
          request={element}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }
  render() {
    const { Header, Row, HeaderCell, Body, Cell } = Table;
    return (
      <Layout>
        <h3>Request List</h3>

        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>

        <Table celled>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount (wei)</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
              <HeaderCell>IsCompleted ?</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <h3> Total Requests : {this.props.requestsCount}</h3>
        <h3>This Campaign Address : {this.props.address}</h3>
      </Layout>
    );
  }
}

export default RequestIndex;
