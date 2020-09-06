var Election = artifacts.require("./Election.sol");


contract("Election", accounts => {
    it("initializes with two candidates", async () => {
      let instance = await Election.deployed();
      let count = await instance.candidatesCount.call();
      assert.equal(count.valueOf(), 2);
    });

    it("initializes the candidates with the correct values", async () => {
        let instance = await Election.deployed();
        let candidate_1 = await instance.candidates.call(1);

        assert.equal(candidate_1[0], 1, "contains the correct id");
        assert.equal(candidate_1[1], "Candidate 1", "contains the correct name");
        assert.equal(candidate_1[2], 0, "contains the correct votes count");

        let candidate_2 = await instance.candidates.call(2);

        assert.equal(candidate_2[0], 2, "contains the correct id");
        assert.equal(candidate_2[1], "Candidate 2", "contains the correct name");
        assert.equal(candidate_2[2], 0, "contains the correct votes count");
      });

      it("allows a voter to cast a vote", async () =>  {
        let instance = await Election.deployed();
        candidateId = 1;
        receipt = await instance.vote(candidateId, { from: accounts[0] });
        assert.equal(receipt.logs.length, 1, "an event was triggered");
        assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
        assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");

        voted = await instance.voters(accounts[0]);
        assert(voted, "the voter was marked as voted");

        candidate = await instance.candidates(candidateId);
        assert.equal(candidate[2], 1, "increments the candidate's vote count");
      });
    
      it("throws an exception for invalid candidates", async () => {
        let instance = await Election.deployed();

        try {
            await instance.vote(99, { from: accounts[1] })
            assert.fail("Invalid candidate throws an exception")
        } catch(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
        }

        var candidate1 = await instance.candidates(1);
        var voteCount = candidate1[2];
        assert.equal(voteCount, 1, "candidate 1 did not receive any votes");

        var candidate2 = await instance.candidates(2);
        voteCount = candidate2[2];
        assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
      });
    
      it("throws an exception for double voting", async () => {
        let instance = await Election.deployed();
        var candidateId = 2;
        await instance.vote(candidateId, { from: accounts[1] });
        let candidate = await instance.candidates(candidateId);
        var voteCount = candidate[2];
        assert.equal(voteCount, 1, "accepts first vote");

        // Try to vote again
        try {
            await instance.vote(candidateId, { from: accounts[1] });
            assert.fail("Double voting throws an exception")
        } catch(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
        }
  
        candidate = await instance.candidates(1);
        var voteCount = candidate[2];
        assert.equal(voteCount, 1, "candidate 1 did not receive any votes");

        candidate = await instance.candidates(2);
        var voteCount = candidate[2];
        assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
      });
});