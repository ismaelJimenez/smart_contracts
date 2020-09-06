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
});