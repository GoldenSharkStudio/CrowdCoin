import React, {Component} from "react";
import {Form, Button, Message, Input, Icon} from "semantic-ui-react";
import Layout from "../../../components/Layout";
import instance from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import {Link, Router} from "../../../routes";

class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false,
        errorMessage: ''
    };

    static async getInitialProps(props) {
        const {address} = props.query;

        return {address};
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''});

        const campaign = instance(this.props.address);

        const {description, value, recipient} = this.state;

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send({
                from: accounts[0]
            });

            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (e) {
            this.setState({errorMessage: e.message});
        }

        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        <Button basic><Icon name="arrow left"/> Back</Button>
                    </a>
                </Link>

                <h3>Create a Request</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({description: event.target.value})}
                            icon={<Icon name="text cursor"/>}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({value: event.target.value})}
                            icon={<Icon name="ethereum"/>}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => this.setState({recipient: event.target.value})}
                            icon={<Icon name="address card outline"/>}
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage}/>

                    <Button primary loading={this.state.loading}>
                        <Icon name="add circle"/> Create Request
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;