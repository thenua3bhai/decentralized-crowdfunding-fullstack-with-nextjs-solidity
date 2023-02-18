import React, { cloneElement, Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../etheriumSide/web3";
import Campaign from "../etheriumSide/build/Campaign.json";
import { Router } from "../routes";

export class RenderRow extends Component {
  onApprove = async () => {
    const instance = await new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      this.props.address
    );
    const accounts = await web3.eth.getAccounts();
    await instance.methods
      .approveRequest(this.props.id)
      .send({ from: accounts[0] });

    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };
  onFinalize = async () => {
    const instance = await new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      this.props.address
    );
    const accounts = await web3.eth.getAccounts();
    await instance.methods
      .finalizeRequest(this.props.id)
      .send({ from: accounts[0] });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };
  render() {
    const { Cell, Row } = Table;
    const { request, id, approversCount } = this.props;
    const readyToFinalize = request.yesCount > approversCount / 2;
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id + 1}</Cell>

        <Cell>{request.description}</Cell>
        <Cell>{request.value}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.yesCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
        <Cell>{request.complete ? "Yes" : "No"}</Cell>
      </Row>
    );
  }
}

export default RenderRow;
