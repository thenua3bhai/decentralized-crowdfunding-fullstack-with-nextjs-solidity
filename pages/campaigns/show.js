import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../etheriumSide/build/Campaign.json";
import web3 from "../../etheriumSide/web3";
import { Button, Card, Grid } from "semantic-ui-react";
import { Link } from "../../routes";
import ContributeForm from "../../components/ContributeForm";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const instance = new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      props.query.address
    );
    const summary = await instance.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      manager,
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
    } = this.props;
    const items = [
      {
        header: manager,
        meta: "Address of the campaign creator",
        description: "Campaign creator",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "minimum Contribution (wei)",
        description: "Minimum contribution",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        description: "available ethers to spend by manager",
        meta: "Balance in ether",
      },
      {
        header: requestsCount,
        description: "Total requests count to withdraw ethers",
        meta: "Requests Count",
      },
      {
        header: approversCount,
        description: "Total approvers ",
        meta: "Approvers Count",
      },
    ];

    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <div>
          <h2>Campaign Details are</h2>
          <ol>
            <li>Minimum Contribution : {this.props.minimumContribution}</li>
            <li>Balance : {this.props.balance}</li>
            <li>Total Requests : {this.props.requestsCount}</li>
            <li>Approved requests : {this.props.approversCount}</li>
            <li>Campaign Creater: {this.props.manager}</li>
          </ol>

          <Grid>
            <Grid.Row>
              <Grid.Column width={11}>{this.renderCards()}</Grid.Column>
              <Grid.Column width={5}>
                <ContributeForm address={this.props.address} />{" "}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                  <a>
                    {" "}
                    <Button primary>View Requests</Button>
                  </a>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default CampaignShow;
