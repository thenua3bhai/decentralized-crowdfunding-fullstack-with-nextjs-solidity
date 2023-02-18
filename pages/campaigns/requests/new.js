import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import web3 from "../../../etheriumSide/web3";
import Campaign from "../../../etheriumSide/build/Campaign.json";
import { Router, Link } from "../../../routes";

class NewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      neededMoney: "",
      recipient: "",
      errorMsg: "",
      loading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  static async getInitialProps(props) {
    return { address: props.query.address };
  }
  async onSubmit(event) {
    //this is an event handler

    event.preventDefault();
    this.setState({ loading: true, errorMsg: "" });
    try {
      const instance = await new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        this.props.address
      );
      const accounts = await web3.eth.getAccounts();
      const { description, neededMoney, recipient } = this.state;
      await instance.methods
        .createRequest(description, neededMoney, recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false });
  }
  render() {
    return (
      <Layout>
        <h2>Create New Request</h2>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>BAck</a>
        </Link>
        <Form
          onSubmit={this.onSubmit}
          error={!!this.state.errorMsg}
          className="fluid"
        >
          <Form.Field>
            {" "}
            <label>Description</label>
            <Input
              placeholder=""
              value={this.state.description}
              onChange={(evt) => {
                this.setState({ description: evt.target.value });
              }}
            />
          </Form.Field>
          <Form.Field>
            {" "}
            <label>Amount In wei</label>
            <Input
              placeholder="100"
              label="wei"
              labelPosition="right"
              value={this.state.neededMoney}
              onChange={(evt) => {
                this.setState({ neededMoney: evt.target.value });
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              placeholder="0xx..xxxx"
              value={this.state.recipient}
              onChange={(evt) => {
                this.setState({ recipient: evt.target.value });
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

export default NewRequest;
