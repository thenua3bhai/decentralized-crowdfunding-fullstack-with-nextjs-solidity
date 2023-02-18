import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import web3 from "../etheriumSide/web3";
import Campaign from "../etheriumSide/build/Campaign.json";
import { Router } from "../routes";

class ContributeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { contribution: "", errorMsg: "", loading: false };
    this.onSubmit = this.onSubmit.bind(this);
  }
  async onSubmit(event) {
    event.preventDefault();
    console.log("I am in onSubmit() of contribute form");
    this.setState({ loading: true, errorMsg: "" });
    try {
      const instance = await new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        this.props.address
      );
      const accounts = await web3.eth.getAccounts();
      await instance.methods
        .contribute()
        .send({ from: accounts[0], value: this.state.contribution });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false, contribution: "" }); //reset the values
  }
  render() {
    return (
      <div>
        <h1>I am from contribute form</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
          <Form.Field>
            <label>Contribute</label>
            <Input
              placeholder="100"
              label="wei"
              labelPosition="right"
              value={this.state.contribution}
              onChange={(evt) => {
                this.setState({ contribution: evt.target.value });
              }}
            />
          </Form.Field>
          <Message
            error
            header="Something went wrong!!"
            content={this.state.errorMsg}
          />

          <Button loading={this.state.loading} primary>
            Contribute
          </Button>
        </Form>
      </div>
    );
  }
}

export default ContributeForm;
