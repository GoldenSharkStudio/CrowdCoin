import React, {Component} from "react";
import {Table, Button, Icon} from "semantic-ui-react";
import web3 from "../ethereum/web3";
import instance from "../ethereum/campaign";

class RequestRow extends Component {
    state = {
      loadingApprover: false,
        loadingFinalize: false,
        approvalCount: this.props.request.approvalCount
    };

    onApprove = async () => {
        this.setState({loadingApprover: true});

        const campaign = instance(this.props.address);

        const accounts = await web3.eth.getAccounts();

        try {
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
        } catch (e) {

        }

        this.setState({loadingApprover: false, approvalCount: parseInt(this.state.approvalCount)+1});
    };

    onFinalize = async () => {
        this.setState({loadingFinalize: true});

        const campaign = instance(this.props.address);

        const accounts = await web3.eth.getAccounts();

        try {
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
        } catch (e) {

        }

        this.setState({loadingFinalize: false});
    }

    render() {
        const {Row, Cell} = Table;
        const {id, request, approversCount} = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return(
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{this.state.approvalCount}/{approversCount}</Cell>
                <Cell>
                    <Button color="green" basic onClick={this.onApprove} loading={this.state.loadingApprover} disabled={request.complete}>
                        <Icon name="heart outline"/> Approve
                    </Button>
                </Cell>
                <Cell>
                    <Button color="red" basic onClick={this.onFinalize} loading={this.state.loadingFinalize} disabled={request.complete}>
                        <Icon name="stop circle"/> Finalize
                    </Button>
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;