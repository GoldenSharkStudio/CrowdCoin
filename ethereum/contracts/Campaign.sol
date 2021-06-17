pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 _minimum) public {
        address newCampaign = new Campaign(_minimum, msg.sender);

        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers; // contributors
    uint256 public approversCount;

    modifier restricted() {
        require(manager == msg.sender);
        _;
    }

    function Campaign(uint256 _minimum, address _manager) public {
        manager = _manager;

        minimumContribution = _minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        approvers[msg.sender] = true;

        approversCount++;
    }

    function createRequest(string _description, uint256 _value, address _recipient) public restricted {
        Request memory newRequest = Request({
        description: _description,
        value: _value,
        recipient: _recipient,
        complete: false,
        approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint256 _index) public {
        Request storage request = requests[_index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;

        request.approvalCount++;
    }

    function finalizeRequest(uint256 _index) public payable restricted {
        Request storage request = requests[_index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);

        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}