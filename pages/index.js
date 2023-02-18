import React, { Component } from "react";
import factory from "../etheriumSide/factory";
import { Card, Button } from "semantic-ui-react";

import Layout from "../components/Layout";
import { Router, Link } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedContracts().call();
    return { campaigns: campaigns };
  }
  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h2>Open Campaigns</h2>
          <Link route="/campaigns/New">
            <a>
              <Button
                floated={"right"}
                content="Create Campaign"
                icon="add"
                primary={true}
              />
            </a>
          </Link>
          {this.renderCampaigns()}{" "}
        </div>
      </Layout>
    );
  }
}
export default CampaignIndex;
