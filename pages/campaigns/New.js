import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../etheriumSide/factory";
import web3 from "../../etheriumSide/web3";
import { Link, Router } from "../../routes";

class CampaignNew extends Component {
  constructor(props) {
    super(props);
    this.state = { minimumContribution: "", errorMsg: "", loading: false };
    this.onSubmit = this.onSubmit.bind(this);
  }
  async onSubmit(event) {
    //this is an event handler

    event.preventDefault();
    this.setState({ loading: true, errorMsg: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false });
  }
  render() {
    return (
      <Layout>
        <h2>Create a campaign</h2>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              placeholder="100"
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(evt) => {
                this.setState({ minimumContribution: evt.target.value });
              }}
            />
          </Form.Field>
          <Message
            error
            header="Something went wrong!"
            content={this.state.errorMsg}
          />

          <Button loading={this.state.loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
